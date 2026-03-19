import { cache } from "react";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";
import type { GroupDto, UserDto } from "@/lib/api/generated";

export const fetchUsersByIds = cache(async (ids: number[]): Promise<UserDto[]> => {
  const unique = Array.from(new Set(ids.filter((id) => Number.isFinite(id))));
  if (unique.length === 0) return [];

  const results = await Promise.all(
    unique.map(async (id) => {
      try {
        const response = await apiClient.security.getUserByUserId({ userId: id });
        return response.data ?? null;
      } catch (error) {
        if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
          return null;
        }
        throw error;
      }
    })
  );

  return results.filter((user): user is UserDto => Boolean(user));
});

export const fetchGroupsByIds = cache(async (ids: number[]): Promise<GroupDto[]> => {
  const unique = Array.from(new Set(ids.filter((id) => Number.isFinite(id))));
  if (unique.length === 0) return [];

  const results = await Promise.all(
    unique.map(async (id) => {
      try {
        const response = await apiClient.group.getGroupById({ id });
        return response.data ?? null;
      } catch (error) {
        if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
          return null;
        }
        throw error;
      }
    })
  );

  return results.filter((group): group is GroupDto => Boolean(group));
});
