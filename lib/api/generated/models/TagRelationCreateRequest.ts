/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagRelationCreateDataPermissionItem } from './TagRelationCreateDataPermissionItem';
import type { TagRelationCreateFieldMappingItem } from './TagRelationCreateFieldMappingItem';
import type { TagRelationCreatePermissionItem } from './TagRelationCreatePermissionItem';
export type TagRelationCreateRequest = {
  tagGroupName?: string;
  rootTagId?: number;
  description?: string;
  enableHyperTable?: boolean;
  isView?: boolean;
  sqlQueryScript?: string;
  tagRelationFieldMappings?: Array<TagRelationCreateFieldMappingItem>;
  tagRelationPermissions?: Array<TagRelationCreatePermissionItem>;
  tagRelationDataPermissions?: Array<TagRelationCreateDataPermissionItem>;
};

