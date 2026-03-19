export const TAG_SOURCE_OPTIONS = [
  { value: "Normal tag", label: "Normal tag" }
] as const;

export type TagSourceOption = (typeof TAG_SOURCE_OPTIONS)[number];
export type TagSourceValue = TagSourceOption["value"];

export const TAG_TYPE_OPTIONS: Record<TagSourceValue, { value: string; label: string }[]> = {
  "Normal tag": [
    { value: "Integer", label: "Integer" },
    { value: "Big Integer", label: "Big Integer" },
    { value: "Double", label: "Double" },
    { value: "String", label: "String" },
    { value: "Boolean", label: "Boolean" }
  ]
};

export const TAG_MODE_OPTIONS = [
  { value: "Default", label: "Default" },
  { value: "Condition", label: "Condition" }
] as const;

export type TagModeOption = (typeof TAG_MODE_OPTIONS)[number];
export type TagModeValue = TagModeOption["value"];

export const NUMERIC_CONDITION_OPERATORS = [">", "<", ">=", "<=", "==", "!="] as const;
export const STRING_CONDITION_OPERATORS = ["==", "!=", "CONTAINS", "NOT_CONTAINS"] as const;

export type ConditionOperator =
  | (typeof NUMERIC_CONDITION_OPERATORS)[number]
  | (typeof STRING_CONDITION_OPERATORS)[number];

export const TAG_RELATION_FIELD_TYPES = [
  { value: "integer", label: "Integer" },
  { value: "bigint", label: "Big Integer" },
  { value: "double precision", label: "Double" },
  { value: "text", label: "String" },
  { value: "boolean", label: "Boolean" },
  { value: "blob", label: "Blob" }
] as const;

export function getConditionOperators(tagType: string | null | undefined) {
  if (!tagType) {
    return NUMERIC_CONDITION_OPERATORS;
  }

  switch (tagType) {
    case "Integer":
    case "Double":
    case "Big Integer":
      return NUMERIC_CONDITION_OPERATORS;
    default:
      return STRING_CONDITION_OPERATORS;
  }
}

export function defaultTagTypeForSource(source: TagSourceValue) {
  const options = TAG_TYPE_OPTIONS[source];
  return options?.[0]?.value ?? "";
}

export const TAG_SORT_OPTIONS = [
  { value: "name-asc", label: "A-Z", sortBy: "tagName", sortOrder: "asc" },
  { value: "name-desc", label: "Z-A", sortBy: "tagName", sortOrder: "desc" },
  { value: "created-desc", label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  { value: "created-asc", label: "Oldest", sortBy: "createdAt", sortOrder: "asc" }
] as const;

export const TAG_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_TAG_PAGE_SIZE = 20;
