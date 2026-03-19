/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagRelationDataPermissionDto } from './TagRelationDataPermissionDto';
import type { TagRelationFieldDto } from './TagRelationFieldDto';
import type { TagRelationFieldMappingDto } from './TagRelationFieldMappingDto';
import type { TagRelationIdentityDto } from './TagRelationIdentityDto';
import type { TagRelationPermissionDto } from './TagRelationPermissionDto';
export type TagRelationDto = {
  tagGroupId?: number;
  tagGroupName?: string;
  server?: string;
  rootTagId?: number;
  description?: string;
  createAt?: string;
  updateAt?: string;
  enableHyperTable?: boolean;
  isView?: boolean;
  sqlQueryScript?: string;
  userId?: number;
  updateBy?: number;
  fieldMappings?: Array<TagRelationFieldMappingDto>;
  fields?: Array<TagRelationFieldDto>;
  identities?: Array<TagRelationIdentityDto>;
  tagRelationPermissions?: Array<TagRelationPermissionDto>;
  tagRelationDataPermissions?: Array<TagRelationDataPermissionDto>;
};

