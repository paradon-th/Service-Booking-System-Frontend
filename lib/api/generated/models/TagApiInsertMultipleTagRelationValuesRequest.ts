/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagApiInsertMultipleTagRelationValueItem } from './TagApiInsertMultipleTagRelationValueItem';
export type TagApiInsertMultipleTagRelationValuesRequest = {
  tagRelationName?: string;
  quality?: number;
  status?: number;
  timeStamp?: string;
  removeAfter?: boolean;
  items?: Array<TagApiInsertMultipleTagRelationValueItem>;
  connectionTimeout?: number;
};

