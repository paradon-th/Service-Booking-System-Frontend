/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ICubeTestInsertTagRelationDynamicSinkItem } from './ICubeTestInsertTagRelationDynamicSinkItem';
import type { ICubeTestInsertTagRelationSourceSinkItem } from './ICubeTestInsertTagRelationSourceSinkItem';
import type { ICubeTestInsertTagRelationValueSinkItem } from './ICubeTestInsertTagRelationValueSinkItem';
export type ICubeTestInsertTagRelationValueRequest = {
  interfaceId?: number;
  sinkTagRelation?: string;
  keepValue?: boolean;
  sourceSink?: Array<ICubeTestInsertTagRelationSourceSinkItem>;
  valueSink?: Array<ICubeTestInsertTagRelationValueSinkItem>;
  dynamicSink?: Array<ICubeTestInsertTagRelationDynamicSinkItem>;
};

