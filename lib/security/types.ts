export type SecurityEntityType = "user" | "group";

export type SecurityEntity = {
  id: number;
  name: string;
  description?: string | null;
  type: SecurityEntityType;
};

export type PermissionMatrix = {
  id?: number;
  assigneeId: number;
  assigneeType: SecurityEntityType;
  displayName: string;
  canAccess: boolean;
  canCreate: boolean;
  canModify: boolean;
  canDelete: boolean;
};

export type PermissionMatrixInput = {
  id?: number;
  userId?: number;
  groupId?: number;
  canAccess?: boolean;
  canCreate?: boolean;
  canModify?: boolean;
  canDelete?: boolean;
  displayName?: string;
};

export function normalizePermissionMatrixInput(item: PermissionMatrixInput, fallbackName?: string): PermissionMatrix {
  const assigneeType = item.userId ? "user" : "group";
  const assigneeId = item.userId ?? item.groupId;

  if (!assigneeId) {
    throw new Error("Permission item missing assignee identifier");
  }

  return {
    id: item.id,
    assigneeId,
    assigneeType,
    displayName: item.displayName ?? fallbackName ?? `${assigneeType === "user" ? "User" : "Group"} #${assigneeId}`,
    canAccess: item.canAccess ?? false,
    canCreate: item.canCreate ?? false,
    canModify: item.canModify ?? false,
    canDelete: item.canDelete ?? false
  };
}

export function toCreatePermissionItem(matrix: PermissionMatrix) {
  return {
    userId: matrix.assigneeType === "user" ? matrix.assigneeId : undefined,
    groupId: matrix.assigneeType === "group" ? matrix.assigneeId : undefined,
    canAccess: matrix.canAccess,
    canCreate: matrix.canCreate,
    canModify: matrix.canModify,
    canDelete: matrix.canDelete
  };
}

export function toUpdatePermissionItem(matrix: PermissionMatrix) {
  return {
    id: matrix.id,
    userId: matrix.assigneeType === "user" ? matrix.assigneeId : undefined,
    groupId: matrix.assigneeType === "group" ? matrix.assigneeId : undefined,
    canAccess: matrix.canAccess,
    canCreate: matrix.canCreate,
    canModify: matrix.canModify,
    canDelete: matrix.canDelete
  };
}

export function ensureAccess(matrix: PermissionMatrix, key: keyof Pick<PermissionMatrix, "canCreate" | "canModify" | "canDelete">) {
  if (matrix[key] && !matrix.canAccess) {
    return { ...matrix, canAccess: true };
  }
  return matrix;
}

export function clearChildrenWhenAccessRevoked(matrix: PermissionMatrix) {
  if (!matrix.canAccess) {
    return {
      ...matrix,
      canCreate: false,
      canModify: false,
      canDelete: false
    };
  }
  return matrix;
}
