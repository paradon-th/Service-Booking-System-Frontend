import { apiClient } from "@/lib/api/client";
import type { TagDto, TagDtoPagedResult } from "@/lib/api/generated";
import { ApiError } from "@/lib/api/generated/core/ApiError";

export type TagListParams = {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
};

export type TagListResult = TagDtoPagedResult & {
  items: TagDto[];
};

export async function loadTags({
  page = 1,
  pageSize = 20,
  searchTerm,
  sortBy,
  sortOrder
}: TagListParams = {}): Promise<TagListResult> {
  try {
    const response = await apiClient.tag.getTag({ page, pageSize, searchTerm, sortBy, sortOrder });
    const data = response.data ?? {};

    return {
      items: data.items ?? [],
      pagination: data.pagination
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.body?.message ?? "Unable to load tags");
    }
    throw error;
  }
}
