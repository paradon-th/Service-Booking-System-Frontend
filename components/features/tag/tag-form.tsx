"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PermissionAssignmentsField, mapPermissionsForCreate, mapPermissionsForUpdate } from "@/components/features/security/permission-assignments-field";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import {
  defaultTagTypeForSource,
  getConditionOperators,
  NUMERIC_CONDITION_OPERATORS,
  TAG_MODE_OPTIONS,
  TAG_SOURCE_OPTIONS,
  TAG_TYPE_OPTIONS,
  type TagModeValue,
  type TagSourceValue
} from "@/lib/tag/constants";
import type {
  TagCreateRequest,
  TagDataPermissionDto,
  TagDto,
  TagPermissionDto,
  TagUpdateRequest
} from "@/lib/api/generated";
import {
  normalizePermissionMatrixInput,
  type PermissionMatrix
} from "@/lib/security/types";

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

const tagFormSchema = z
  .object({
    tagName: z.string().min(3, "Tag name must be at least 3 characters").max(50),
    description: z.string().max(450, "Description must be under 450 characters").optional().or(z.literal("")),
    subDescription: z.string().max(255, "Sub description must be under 255 characters").optional().or(z.literal("")),
    tagSource: z.enum(["Normal tag"]),
    tagType: z.string().min(1, "Choose a tag type"),
    tagMode: z.enum(["Default", "Condition"]),
    unit: z.string().min(1, "Unit is required"),
    conditionOperator: z.string().optional().or(z.literal("")),
    conditionValue: z.string().optional().or(z.literal("")),
    tagPermissions: z.array(permissionSchema).default([]),
    tagDataPermissions: z.array(permissionSchema).default([])
  })
  .superRefine((values, ctx) => {
    if (values.tagMode === "Condition") {
      if (!values.conditionOperator) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["conditionOperator"], message: "Condition operator is required" });
      }
      if (!values.conditionValue?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["conditionValue"], message: "Condition value is required" });
      }
    }

    if (values.conditionOperator) {
      const allowed = getConditionOperators(values.tagType);
      if (!allowed.includes(values.conditionOperator as (typeof NUMERIC_CONDITION_OPERATORS)[number])) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["conditionOperator"], message: "Operator not allowed for this tag type" });
      }
    }
  });

type TagFormValues = z.infer<typeof tagFormSchema>;

type TagFormProps = {
  mode: "create" | "edit";
  defaultValues?: TagDto;
  isSubmitting?: boolean;
  isLoading?: boolean;
  onSubmit: (values: TagCreateRequest | TagUpdateRequest) => Promise<void>;
  onCancel?: () => void;
};

export function TagForm({ mode, defaultValues, isSubmitting, isLoading, onSubmit, onCancel }: TagFormProps) {
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: buildInitialValues(mode, defaultValues)
  });

  useEffect(() => {
    form.reset(buildInitialValues(mode, defaultValues));
  }, [defaultValues, mode, form]);

  const tagSource = form.watch("tagSource") as TagSourceValue;
  const tagMode = form.watch("tagMode") as TagModeValue;
  const tagType = form.watch("tagType");
  const [currentTimestamp, setCurrentTimestamp] = useState(() => new Date());

  useEffect(() => {
    if (mode !== "create") return;
    const timer = setInterval(() => setCurrentTimestamp(new Date()), 1000);
    return () => clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    const options = TAG_TYPE_OPTIONS[tagSource] ?? [];
    if (!options.some((option) => option.value === tagType)) {
      form.setValue("tagType", options[0]?.value ?? "");
    }
  }, [tagSource, form, tagType]);

  useEffect(() => {
    const allowed = getConditionOperators(tagType);
    const current = form.getValues("conditionOperator");
    if (current && !allowed.includes(current as (typeof NUMERIC_CONDITION_OPERATORS)[number])) {
      form.setValue("conditionOperator", "");
    }
  }, [tagType, form]);

  const conditionOperators = useMemo(() => getConditionOperators(tagType), [tagType]);
  const tagTypeOptions = TAG_TYPE_OPTIONS[tagSource] ?? [];
  const systemInfo = buildSystemInfo({ mode, detail: defaultValues, currentTimestamp });

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
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <Tabs defaultValue="general" className="space-y-5">
            <TabsList className="grid w-full grid-cols-3 rounded-md border bg-muted/30 p-1">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <section className="space-y-3">
                <FormField
                  control={form.control}
                  name="tagName"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid items-start gap-3 md:grid-cols-[140px_1fr]">
                        <FormLabel className="pt-2 text-sm font-medium text-muted-foreground md:text-right">
                          Tag name
                        </FormLabel>
                        <div className="space-y-1.5">
                          <FormControl>
                            <Input {...field} autoFocus placeholder="Enter tag name" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid items-start gap-3 md:grid-cols-[140px_1fr]">
                        <FormLabel className="pt-2 text-sm font-medium text-muted-foreground md:text-right">
                          Description
                        </FormLabel>
                        <div className="space-y-1.5">
                          <FormControl>
                            <Input {...field} placeholder="Optional description" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subDescription"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid items-start gap-3 md:grid-cols-[140px_1fr]">
                        <FormLabel className="pt-2 text-sm font-medium text-muted-foreground md:text-right">
                          Sub description
                        </FormLabel>
                        <div className="space-y-1.5">
                          <FormControl>
                            <Input {...field} placeholder="Optional short detail" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid items-start gap-3 md:grid-cols-[140px_1fr]">
                        <FormLabel className="pt-2 text-sm font-medium text-muted-foreground md:text-right">
                          Eng. unit
                        </FormLabel>
                        <div className="space-y-1.5">
                          <FormControl>
                            <Input {...field} placeholder="e.g. °C" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagSource"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid items-start gap-3 md:grid-cols-[140px_1fr]">
                        <FormLabel className="pt-2 text-sm font-medium text-muted-foreground md:text-right">
                          Tag source
                        </FormLabel>
                        <div className="space-y-1.5">
                          <Select value={field.value} onValueChange={field.onChange} disabled={mode === "edit"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TAG_SOURCE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagType"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid items-start gap-3 md:grid-cols-[140px_1fr]">
                        <FormLabel className="pt-2 text-sm font-medium text-muted-foreground md:text-right">
                          Tag type
                        </FormLabel>
                        <div className="space-y-1.5">
                          <Select value={field.value} onValueChange={field.onChange} disabled={mode === "edit"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tag type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tagTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagMode"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid items-start gap-3 md:grid-cols-[140px_1fr]">
                        <FormLabel className="pt-2 text-sm font-medium text-muted-foreground md:text-right">
                          Tag mode
                        </FormLabel>
                        <div className="space-y-1.5">
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="flex flex-wrap gap-3"
                            >
                              {TAG_MODE_OPTIONS.map((option) => (
                                <label key={option.value} htmlFor={`tag-mode-${option.value}`} className="flex cursor-pointer items-center space-x-2">
                                  <RadioGroupItem value={option.value} id={`tag-mode-${option.value}`} />
                                  <span className="text-sm font-normal">{option.label}</span>
                                </label>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid items-start gap-3 md:grid-cols-[140px_1fr]">
                  <span className="pt-2 text-sm font-medium text-muted-foreground md:text-right">Condition</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="conditionOperator"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <span className="text-xs text-muted-foreground">Operator</span>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={tagMode !== "Condition"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {conditionOperators.map((operator) => (
                                <SelectItem key={operator} value={operator}>
                                  {operator}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="conditionValue"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <span className="text-xs text-muted-foreground">Value</span>
                          <FormControl>
                            <Input {...field} placeholder="Threshold" disabled={tagMode !== "Condition"} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <PermissionAssignmentsField
                name="tagPermissions"
                label="Tag permissions"
                description="Controls who can access or manage the tag configuration."
                disabled={isSubmitting}
              />

              <PermissionAssignmentsField
                name="tagDataPermissions"
                label="Data permissions"
                description="Controls who can interact with the tag's data payloads."
                disabled={isSubmitting}
              />
            </TabsContent>

            <TabsContent value="system">
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">System information</h3>
                  <p className="text-sm text-muted-foreground">Key metadata is populated automatically.</p>
                </div>
                <dl className="divide-y divide-border overflow-hidden rounded-md border">
                  {systemInfo.map((item) => (
                    <div key={item.label} className="grid grid-cols-3 gap-4 bg-background px-4 py-3 text-sm">
                      <dt className="text-muted-foreground">{item.label}</dt>
                      <dd className="col-span-2 text-foreground">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            {onCancel ? (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create tag" : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}

function buildInitialValues(mode: "create" | "edit", tag?: TagDto | null): TagFormValues {
  if (!tag) {
    return {
      tagName: "",
      description: "",
      subDescription: "",
      tagSource: "Normal tag",
      tagType: defaultTagTypeForSource("Normal tag"),
      tagMode: "Default",
      unit: "",
      conditionOperator: "",
      conditionValue: "",
      tagPermissions: [],
      tagDataPermissions: []
    };
  }

  const source = (tag.tagSource as TagSourceValue) ?? "Normal tag";
  const tagPermissions = (tag.tagPermissions ?? []).map((permission) =>
    normalizePermissionMatrixInput(permissionToInput(permission))
  );
  const dataPermissions = (tag.tagDataPermissions ?? []).map((permission) =>
    normalizePermissionMatrixInput(permissionToInput(permission))
  );

  return {
    tagName: tag.tagName ?? "",
    description: tag.description ?? "",
    subDescription: tag.subDescription ?? "",
    tagSource: source,
    tagType: tag.tagType ?? defaultTagTypeForSource(source),
    tagMode: (tag.tagMode as TagModeValue) ?? "Default",
    unit: tag.unit ?? "",
    conditionOperator: tag.conditionOperator ?? "",
    conditionValue: tag.conditionValue ?? "",
    tagPermissions,
    tagDataPermissions: dataPermissions
  };
}

function buildCreatePayload(values: TagFormValues): TagCreateRequest {
  return {
    tagName: values.tagName.trim(),
    description: optional(values.description),
    subDescription: optional(values.subDescription),
    tagSource: values.tagSource,
    tagType: values.tagType,
    tagMode: values.tagMode,
    unit: values.unit.trim(),
    conditionOperator: optional(values.conditionOperator),
    conditionValue: optional(values.conditionValue),
    tagPermissions: mapPermissionsForCreate(values.tagPermissions),
    tagDataPermissions: mapPermissionsForCreate(values.tagDataPermissions)
  };
}

function buildUpdatePayload(values: TagFormValues, tag?: TagDto): TagUpdateRequest {
  return {
    tagId: tag?.tagId,
    tagName: values.tagName.trim(),
    description: optional(values.description),
    subDescription: optional(values.subDescription),
    tagMode: values.tagMode,
    unit: values.unit.trim(),
    conditionOperator: optional(values.conditionOperator),
    conditionValue: optional(values.conditionValue),
    tagPermissions: mapPermissionsForUpdate(values.tagPermissions),
    tagDataPermissions: mapPermissionsForUpdate(values.tagDataPermissions)
  };
}

function optional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function permissionToInput(permission: TagPermissionDto | TagDataPermissionDto) {
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

type SystemInfoInput = {
  mode: "create" | "edit";
  detail?: TagDto;
  currentTimestamp: Date;
};

type SystemInfoRow = { label: string; value: string };

function buildSystemInfo({ mode, detail, currentTimestamp }: SystemInfoInput): SystemInfoRow[] {
  if (mode === "create") {
    return [
      { label: "Creator", value: "Current user" },
      { label: "Creation date", value: formatDateTime(currentTimestamp) },
      { label: "Updated by", value: "-" },
      { label: "Last update", value: "-" }
    ];
  }

  const creatorName = (detail as any)?.creatorDisplayName ?? (detail?.userId ? `User #${detail.userId}` : "-");
  const updatedByName = (detail as any)?.updatedByDisplayName ?? (detail?.updatedBy ? `User #${detail.updatedBy}` : "-");

  return [
    { label: "Creator", value: creatorName },
    { label: "Creation date", value: formatDateTime(detail?.createdAt) },
    { label: "Updated by", value: updatedByName },
    { label: "Last update", value: formatDateTime(detail?.updatedAt) }
  ];
}

function formatDateTime(value?: string | Date | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return format(date, "yyyy-MM-dd HH:mm:ss");
}
