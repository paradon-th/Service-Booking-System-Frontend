import { apiClient } from "@/lib/api/client";
import type { TagRelationDto, TagRelationDtoPagedResult } from "@/lib/api/generated";
import { ApiError } from "@/lib/api/generated/core/ApiError";

export type TagRelationListParams = {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
};

export type TagRelationListResult = TagRelationDtoPagedResult & {
  items: TagRelationDto[];
};

export async function loadTagRelations({
  page = 1,
  pageSize = 20,
  searchTerm,
  sortBy,
  sortOrder
}: TagRelationListParams = {}): Promise<TagRelationListResult> {
  try {
    const response = await apiClient.tagRelation.getTagRelation({ page, pageSize, searchTerm, sortBy, sortOrder });
    const data = response.data ?? {};
    return {
      items: data.items ?? [],
      pagination: data.pagination
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.body?.message ?? "Unable to load tag relations");
    }
    throw error;
  }
}
