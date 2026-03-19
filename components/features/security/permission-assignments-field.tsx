"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { AssigneeSearchDialog } from "@/components/features/security/assignee-search-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

import {
  clearChildrenWhenAccessRevoked,
  ensureAccess,
  type PermissionMatrix,
  toCreatePermissionItem,
  toUpdatePermissionItem
} from "@/lib/security/types";

const TABLE_HEADERS = ["Assignee", "Access", "Create", "Modify", "Delete", ""] as const;

type PermissionAssignmentsFieldProps = {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function PermissionAssignmentsField({ name, label, description, disabled }: PermissionAssignmentsFieldProps) {
  const form = useFormContext();
  const { control, watch } = form;
  const { fields, append, remove, update } = useFieldArray({ control, name });

  const assignments = (watch(name) as PermissionMatrix[] | undefined) ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);

  const excludeIds = useMemo(() => {
    return assignments.reduce<{
      user: number[];
      group: number[];
    }>(
      (accumulator, item) => {
        if (item.assigneeType === "user") {
          accumulator.user.push(item.assigneeId);
        } else {
          accumulator.group.push(item.assigneeId);
        }
        return accumulator;
      },
      { user: [], group: [] }
    );
  }, [assignments]);

  const handleToggle = (index: number, key: keyof PermissionMatrix, value: boolean) => {
    const current = assignments[index];
    if (!current) return;

    let next: PermissionMatrix = { ...current, [key]: value };

    if (key === "canAccess") {
      next = clearChildrenWhenAccessRevoked(next);
    } else if (key === "canCreate" || key === "canModify" || key === "canDelete") {
      next = ensureAccess(next, key);
    }

    update(index, next);
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleAdd = (entity: { id: number; name: string; type: "user" | "group" }) => {
    const exists = assignments.some(
      (item) => item.assigneeId === entity.id && item.assigneeType === entity.type
    );

    if (exists) {
      toast.error(`${entity.type === "user" ? "User" : "Group"} already assigned`);
      return;
    }

    append({
      assigneeId: entity.id,
      assigneeType: entity.type,
      displayName: entity.name,
      canAccess: true,
      canCreate: false,
      canModify: false,
      canDelete: false
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-medium">{label}</CardTitle>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <Button size="sm" type="button" onClick={() => setDialogOpen(true)} disabled={disabled}>
          Add assignee
        </Button>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assignees yet. Add a user or group to grant permissions.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {TABLE_HEADERS.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const assignment = assignments[index];
                  if (!assignment) return null;
                  return (
                    <TableRow key={field.id}>
                      <TableCell>
                        <div className="font-medium">{assignment.displayName}</div>
                        <div className="text-xs text-muted-foreground capitalize">{assignment.assigneeType}</div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={assignment.canAccess}
                          onCheckedChange={(checked) => handleToggle(index, "canAccess", checked)}
                          disabled={disabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={assignment.canCreate}
                          onCheckedChange={(checked) => handleToggle(index, "canCreate", checked)}
                          disabled={disabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={assignment.canModify}
                          onCheckedChange={(checked) => handleToggle(index, "canModify", checked)}
                          disabled={disabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={assignment.canDelete}
                          onCheckedChange={(checked) => handleToggle(index, "canDelete", checked)}
                          disabled={disabled}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleRemove(index)}
                          disabled={disabled}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AssigneeSearchDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        excludeIds={excludeIds}
        onSelect={handleAdd}
      />
    </Card>
  );
}

export function mapPermissionsForCreate(assignments: PermissionMatrix[]) {
  return assignments.map(toCreatePermissionItem);
}

export function mapPermissionsForUpdate(assignments: PermissionMatrix[]) {
  return assignments.map(toUpdatePermissionItem);
}
