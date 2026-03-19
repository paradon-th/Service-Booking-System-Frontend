/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MappingSchedulerDto = {
  id?: number;
  mappingName?: string;
  mappingDescription?: string;
  interfaceId?: number;
  periodUnit?: string;
  periodValue?: number;
  cronExpression?: string;
  schedulingId?: number;
  queryStartTime?: string;
  queryEndTime?: string;
  queryMode?: string;
  mergeType?: string;
  valueStatus?: number;
  clearStartTime?: string;
  clearEndTime?: string;
  isClearTimeSameAsQueryTime?: boolean;
  isHealthy?: boolean;
  lastHealthcheckDate?: string;
};

