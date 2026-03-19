/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublisherCreateActionItem } from './PublisherCreateActionItem';
import type { PublisherCreateDynamicValueItem } from './PublisherCreateDynamicValueItem';
import type { PublisherCreateTagItem } from './PublisherCreateTagItem';
import type { PublisherCreateValueTagItem } from './PublisherCreateValueTagItem';
export type PublisherCreateRequest = {
  publishName?: string;
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
  publisherDynamicValues?: Array<PublisherCreateDynamicValueItem>;
  publisherTags?: Array<PublisherCreateTagItem>;
  publisherValueTags?: Array<PublisherCreateValueTagItem>;
  publisherActions?: Array<PublisherCreateActionItem>;
};

