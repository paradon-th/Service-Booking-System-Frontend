/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagDataPermissionDto } from './TagDataPermissionDto';
import type { TagPermissionDto } from './TagPermissionDto';
export type TagDto = {
  tagId?: number;
  server?: string;
  tagName?: string;
  description?: string;
  subDescription?: string;
  tagType?: string;
  tagSource?: string;
  tagMode?: string;
  unit?: string;
  userId?: number;
  timeStamp?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: number;
  periodUnit?: string;
  periodValue?: number;
  conditionOperator?: string;
  conditionValue?: string;
  equation?: string;
  interfaceId?: number;
  tagPermissions?: Array<TagPermissionDto>;
  tagDataPermissions?: Array<TagDataPermissionDto>;
};

