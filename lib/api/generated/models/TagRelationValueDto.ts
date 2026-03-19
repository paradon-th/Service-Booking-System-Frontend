/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagRelationValueFieldMappingValueDto } from './TagRelationValueFieldMappingValueDto';
import type { TagValueDto } from './TagValueDto';
export type TagRelationValueDto = {
  id?: number;
  tagRelationName?: string;
  tagRelationId?: number;
  quality?: number;
  status?: number;
  timeStamp?: string;
  tagIdentities?: Array<TagValueDto>;
  tagFields?: Array<TagValueDto>;
  fieldValues?: Array<TagRelationValueFieldMappingValueDto>;
};

