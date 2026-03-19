/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublisherUpdateActionItem } from './PublisherUpdateActionItem';
import type { PublisherUpdateDynamicValueItem } from './PublisherUpdateDynamicValueItem';
import type { PublisherUpdateTagItem } from './PublisherUpdateTagItem';
import type { PublisherUpdateValueTagItem } from './PublisherUpdateValueTagItem';
export type PublisherUpdateRequest = {
  id?: number;
  description?: string;
  targetUrl?: string;
  authType?: string;
  periodUnit?: string;
  periodValue?: number;
  schedulingId?: number;
  tagRelationId?: number;
  mappingMode?: string;
  interfaceId?: number;
  queryMode?: string;
  queryStartTime?: string;
  queryEndTime?: string;
  valueStatus?: string;
  sinkTagRelation?: string;
  sinkTable?: string;
  mergeType?: string;
  publisherDynamicValues?: Array<PublisherUpdateDynamicValueItem>;
  publisherTags?: Array<PublisherUpdateTagItem>;
  publisherValueTags?: Array<PublisherUpdateValueTagItem>;
  publisherActions?: Array<PublisherUpdateActionItem>;
};

