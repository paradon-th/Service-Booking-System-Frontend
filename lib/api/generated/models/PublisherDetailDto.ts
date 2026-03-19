/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublisherActionDto } from './PublisherActionDto';
import type { PublisherDynamicValueDto } from './PublisherDynamicValueDto';
import type { PublisherTagDto } from './PublisherTagDto';
import type { PublisherValueTagDto } from './PublisherValueTagDto';
export type PublisherDetailDto = {
  id?: number;
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
  publisherDynamicValues?: Array<PublisherDynamicValueDto>;
  publisherTags?: Array<PublisherTagDto>;
  publisherValueTags?: Array<PublisherValueTagDto>;
  publisherActions?: Array<PublisherActionDto>;
};

