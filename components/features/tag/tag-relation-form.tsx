"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PermissionAssignmentsField, mapPermissionsForCreate, mapPermissionsForUpdate } from "@/components/features/security/permission-assignments-field";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TAG_RELATION_FIELD_TYPES } from "@/lib/tag/constants";
import type {
  TagRelationCreateFieldMappingItem,
  TagRelationCreateRequest,
  TagRelationDataPermissionDto,
  TagRelationDto,
  TagRelationFieldMappingDto,
  TagRelationPermissionDto,
  TagRelationUpdateFieldMappingItem,
  TagRelationUpdateRequest
} from "@/lib/api/generated";
import {
  normalizePermissionMatrixInput,
  type PermissionMatrix
} from "@/lib/security/types";

const namePattern = /^[^\s.]+$/;

const permissionSchema = z.object({
  id: z.number().optional(),
  assigneeId: z.number(),
  assigneeType: z.enum(["user", "group"]),
  displayName: z.string().min(1),
  canAccess: z.boolean(),
  canCreate: z.boolean(),
  canModify: z.boolean(),
  canDelete: z.boolean()
});

const fieldMappingSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, "Column name is required")
    .max(60, "Column name too long")
    .regex(namePattern, "Column name cannot contain spaces or dots"),
  dataType: z.string().min(1, "Select a data type"),
  notNull: z.boolean().default(false),
  isIdentity: z.boolean().default(false)
});

const tagRelationFormSchema = z
  .object({
    tagGroupName: z.string().min(3, "Name must be at least 3 characters").max(80),
    description: z.string().max(450).optional().or(z.literal("")),
    rootTagId: z.string().optional().or(z.literal("")),
    enableHyperTable: z.boolean().default(false),
    isView: z.boolean().default(false),
    sqlQueryScript: z.string().optional().or(z.literal("")),
    fieldMappings: z.array(fieldMappingSchema),
    tagRelationPermissions: z.array(permissionSchema).default([]),
    tagRelationDataPermissions: z.array(permissionSchema).default([])
  })
  .superRefine((values, ctx) => {
    if (values.isView && !values.sqlQueryScript?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sqlQueryScript"], message: "SQL script is required when using view mode" });
    }

    if (!values.isView && values.fieldMappings.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["fieldMappings"], message: "Add at least one column" });
    }

    const duplicateNames = findDuplicates(values.fieldMappings.map((item) => item.name.toLowerCase()));
    if (duplicateNames.length > 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["fieldMappings"], message: "Column names must be unique" });
    }
  });

type TagRelationFormValues = z.infer<typeof tagRelationFormSchema>;

type RootTagOption = {
  tagId: number;
  label: string;
};

type TagRelationFormProps = {
  mode: "create" | "edit";
  defaultValues?: TagRelationDto;
  isSubmitting?: boolean;
  isLoading?: boolean;
  onSubmit: (values: TagRelationCreateRequest | TagRelationUpdateRequest) => Promise<void>;
  onCancel?: () => void;
};

export function TagRelationForm({ mode, defaultValues, isSubmitting, isLoading, onSubmit, onCancel }: TagRelationFormProps) {
  const form = useForm<TagRelationFormValues>({
    resolver: zodResolver(tagRelationFormSchema),
    defaultValues: buildInitialValues(mode, defaultValues)
  });

  const fieldArray = useFieldArray({ control: form.control, name: "fieldMappings" });
  const isViewMode = form.watch("isView");
  const [rootTagOptions, setRootTagOptions] = useState<RootTagOption[]>([]);
  const [rootTagLoading, setRootTagLoading] = useState(false);
  const [rootTagError, setRootTagError] = useState<string | null>(null);

  useEffect(() => {
    form.reset(buildInitialValues(mode, defaultValues));
  }, [defaultValues, mode, form]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setRootTagLoading(true);
      setRootTagError(null);
      try {
        const response = await fetch("/api/tag/options?pageSize=100", { credentials: "include", signal: controller.signal });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body?.message ?? "Unable to load tags");
        }
        const data = await response.json();
        const options: RootTagOption[] = (data?.data ?? []).map((item: any) => ({
          tagId: item.tagId,
          label: item.tagName ?? `Tag #${item.tagId}`
        }));
        setRootTagOptions(options);
      } catch (error) {
        if (!controller.signal.aborted) {
          setRootTagError(error instanceof Error ? error.message : "Unable to load tags");
        }
      } finally {
        if (!controller.signal.aborted) {
          setRootTagLoading(false);
        }
      }
    };

    void load();

    return () => controller.abort();
  }, []);

  const fieldCount = fieldArray.fields.length;
  const onSubmitHandler = form.handleSubmit(async (values) => {
    const payload = mode === "create" ? buildCreatePayload(values) : buildUpdatePayload(values, defaultValues);
    await onSubmit(payload);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className="space-y-8" onSubmit={onSubmitHandler}>
          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">General information</h3>
              <p className="text-sm text-muted-foreground">Define the relation container and optional root tag.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tagGroupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter relation name" autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rootTagId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Root tag</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={rootTagLoading || !!rootTagError}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={rootTagLoading ? "Loading tags" : "Optional"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {rootTagOptions.map((option) => (
                          <SelectItem key={option.tagId} value={option.tagId.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {rootTagError ? <p className="text-xs text-destructive">{rootTagError}</p> : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Optional description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="enableHyperTable"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div>
                      <FormLabel className="text-base">Enable hypertable</FormLabel>
                      <p className="text-sm text-muted-foreground">Optimise storage for time-series workloads.</p>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isView"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div>
                      <FormLabel className="text-base">View mode</FormLabel>
                      <p className="text-sm text-muted-foreground">Use a custom SQL script instead of column mapping.</p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="sqlQueryScript"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SQL script</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="SELECT ..."
                      disabled={!form.watch("isView")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Field mapping</h3>
                <p className="text-sm text-muted-foreground">Define the output schema for relation rows.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fieldArray.append(createEmptyFieldMapping())}
                disabled={isSubmitting || isViewMode}>
                Add column
              </Button>
            </div>

            <div className="space-y-3">
              {fieldArray.fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-center justify-between pb-3">
                    <div className="text-sm font-medium">Column {index + 1}</div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={index === 0 || isSubmitting || isViewMode}
                        onClick={() => fieldArray.swap(index, index - 1)}>
                        Up
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={index === fieldCount - 1 || isSubmitting || isViewMode}
                        onClick={() => fieldArray.swap(index, index + 1)}>
                        Down
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        disabled={fieldCount <= 1 || isSubmitting || isViewMode}
                        onClick={() => fieldArray.remove(index)}>
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`fieldMappings.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Column name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="column_name" disabled={isViewMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fieldMappings.${index}.dataType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange} disabled={isViewMode}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TAG_RELATION_FIELD_TYPES.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-6 pt-3">
                    <FormField
                      control={form.control}
                      name={`fieldMappings.${index}.notNull`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isViewMode} />
                          </FormControl>
                          <FormLabel>Not null</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fieldMappings.${index}.isIdentity`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isViewMode} />
                          </FormControl>
                          <FormLabel>Identity</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          <section className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Permissions</h3>
              <p className="text-sm text-muted-foreground">Grant relation and data-level access to users and groups.</p>
            </div>

            <PermissionAssignmentsField
              name="tagRelationPermissions"
              label="Relation permissions"
              description="Controls who can manage the relation definition."
              disabled={isSubmitting}
            />

            <PermissionAssignmentsField
              name="tagRelationDataPermissions"
              label="Data permissions"
              description="Controls who can read or write relation values."
              disabled={isSubmitting}
            />
          </section>

          <div className="flex justify-end gap-2">
            {onCancel ? (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create relation" : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}

function buildInitialValues(mode: "create" | "edit", relation?: TagRelationDto | null): TagRelationFormValues {
  if (!relation) {
    return {
      tagGroupName: "",
      description: "",
      rootTagId: "",
      enableHyperTable: false,
      isView: false,
      sqlQueryScript: "",
      fieldMappings: [createEmptyFieldMapping()],
      tagRelationPermissions: [],
      tagRelationDataPermissions: []
    };
  }

  return {
    tagGroupName: relation.tagGroupName ?? "",
    description: relation.description ?? "",
    rootTagId: relation.rootTagId ? relation.rootTagId.toString() : "",
    enableHyperTable: relation.enableHyperTable ?? false,
    isView: relation.isView ?? false,
    sqlQueryScript: relation.sqlQueryScript ?? "",
    fieldMappings: (relation.fieldMappings ?? relation.tagRelationFieldMappings ?? []).map((mapping) => normalizeFieldMapping(mapping)),
    tagRelationPermissions: (relation.tagRelationPermissions ?? []).map((item) =>
      normalizePermissionMatrixInput(tagRelationPermissionToInput(item))
    ),
    tagRelationDataPermissions: (relation.tagRelationDataPermissions ?? []).map((item) =>
      normalizePermissionMatrixInput(tagRelationPermissionToInput(item))
    )
  };
}

function buildCreatePayload(values: TagRelationFormValues): TagRelationCreateRequest {
  return {
    tagGroupName: values.tagGroupName.trim(),
    description: optional(values.description),
    rootTagId: parseNumber(values.rootTagId),
    enableHyperTable: values.enableHyperTable,
    isView: values.isView,
    sqlQueryScript: optional(values.sqlQueryScript),
    tagRelationFieldMappings: values.fieldMappings.map((mapping, index) =>
      fieldMappingToCreatePayload(mapping, index)
    ),
    tagRelationPermissions: mapPermissionsForCreate(values.tagRelationPermissions),
    tagRelationDataPermissions: mapPermissionsForCreate(values.tagRelationDataPermissions)
  };
}

function buildUpdatePayload(values: TagRelationFormValues, relation?: TagRelationDto): TagRelationUpdateRequest {
  return {
    tagGroupId: relation?.tagGroupId,
    tagGroupName: values.tagGroupName.trim(),
    description: optional(values.description),
    rootTagId: parseNumber(values.rootTagId),
    sqlQueryScript: optional(values.sqlQueryScript),
    tagRelationFieldMappings: values.fieldMappings.map((mapping, index) =>
      fieldMappingToUpdatePayload(mapping, index)
    ),
    tagRelationPermissions: mapPermissionsForUpdate(values.tagRelationPermissions),
    tagRelationDataPermissions: mapPermissionsForUpdate(values.tagRelationDataPermissions)
  };
}

function parseNumber(value?: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function optional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function createEmptyFieldMapping() {
  return {
    id: undefined,
    name: "",
    dataType: TAG_RELATION_FIELD_TYPES[0]?.value ?? "text",
    notNull: false,
    isIdentity: false
  };
}

function normalizeFieldMapping(mapping: TagRelationFieldMappingDto): TagRelationFormValues["fieldMappings"][number] {
  return {
    id: mapping.id,
    name: mapping.fieldName ?? "",
    dataType: mapping.dataType ?? TAG_RELATION_FIELD_TYPES[0]?.value ?? "text",
    notNull: mapping.isNotNull ?? false,
    isIdentity: mapping.isIdentity ?? false
  };
}

function fieldMappingToCreatePayload(
  mapping: TagRelationFormValues["fieldMappings"][number],
  index: number
): TagRelationCreateFieldMappingItem {
  return {
    fieldName: mapping.name,
    dataType: mapping.dataType,
    isNotNull: mapping.notNull,
    isIdentity: mapping.isIdentity,
    position: index + 1
  };
}

function fieldMappingToUpdatePayload(
  mapping: TagRelationFormValues["fieldMappings"][number],
  index: number
): TagRelationUpdateFieldMappingItem {
  return {
    id: mapping.id,
    fieldName: mapping.name,
    dataType: mapping.dataType,
    isNotNull: mapping.notNull,
    isIdentity: mapping.isIdentity,
    position: index + 1
  };
}

function tagRelationPermissionToInput(permission: TagRelationPermissionDto | TagRelationDataPermissionDto) {
  return {
    id: permission.id,
    userId: permission.userId ?? undefined,
    groupId: permission.groupId ?? undefined,
    canAccess: permission.canAccess ?? false,
    canCreate: permission.canCreate ?? false,
    canModify: permission.canModify ?? false,
    canDelete: permission.canDelete ?? false,
    displayName: (permission as any).displayName ?? (permission as any).name ?? undefined
  };
}

function findDuplicates(values: string[]) {
  const counts = new Map<string, number>();
  const duplicates: string[] = [];
  for (const value of values) {
    const next = (counts.get(value) ?? 0) + 1;
    counts.set(value, next);
    if (next === 2) {
      duplicates.push(value);
    }
  }
  return duplicates;
}
