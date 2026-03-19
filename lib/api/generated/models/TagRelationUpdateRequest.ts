/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagRelationUpdateDataPermissionItem } from './TagRelationUpdateDataPermissionItem';
import type { TagRelationUpdateFieldMappingItem } from './TagRelationUpdateFieldMappingItem';
import type { TagRelationUpdatePermissionItem } from './TagRelationUpdatePermissionItem';
export type TagRelationUpdateRequest = {
  tagGroupId?: number;
  rootTagId?: number;
  tagGroupName?: string;
  description?: string;
  sqlQueryScript?: string;
  tagRelationFieldMappings?: Array<TagRelationUpdateFieldMappingItem>;
  tagRelationPermissions?: Array<TagRelationUpdatePermissionItem>;
  tagRelationDataPermissions?: Array<TagRelationUpdateDataPermissionItem>;
};

