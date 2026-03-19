/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SourceSinkPublisherDto } from './SourceSinkPublisherDto';
import type { ValueSinkPublisherDto } from './ValueSinkPublisherDto';
export type MSSQLTestInsertConfigRequest = {
  interfaceId?: number;
  sinkTable?: string;
  keepValue?: boolean;
  sourceSink?: Array<SourceSinkPublisherDto>;
  valueSink?: Array<ValueSinkPublisherDto>;
  dynamicSink?: Array<ValueSinkPublisherDto>;
};

