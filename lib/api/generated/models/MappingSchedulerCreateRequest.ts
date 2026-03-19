/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MappingFileSystemDto } from './MappingFileSystemDto';
import type { MappingModbusTcpDto } from './MappingModbusTcpDto';
import type { MappingMqttDto } from './MappingMqttDto';
import type { MappingMssqlDto } from './MappingMssqlDto';
import type { MappingOpcuaDto } from './MappingOpcuaDto';
import type { MappingOracleDto } from './MappingOracleDto';
import type { MappingRestApiDto } from './MappingRestApiDto';
import type { MappingSchedulerActionDto } from './MappingSchedulerActionDto';
import type { MappingSharePointDto } from './MappingSharePointDto';
import type { SourceSinkFileMappingDto } from './SourceSinkFileMappingDto';
import type { SourceSinkModbusMappingDto } from './SourceSinkModbusMappingDto';
import type { SourceSinkMqttMappingDto } from './SourceSinkMqttMappingDto';
import type { SourceSinkOpcMappingDto } from './SourceSinkOpcMappingDto';
import type { SourceSinkRdbMappingDto } from './SourceSinkRdbMappingDto';
import type { SourceSinkRestApiMappingDto } from './SourceSinkRestApiMappingDto';
export type MappingSchedulerCreateRequest = {
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
  isEnabled?: boolean;
  mappingSchedulerActions?: Array<MappingSchedulerActionDto>;
  mappingFileSystems?: Array<MappingFileSystemDto>;
  mappingModbusTcps?: Array<MappingModbusTcpDto>;
  mappingMqtts?: Array<MappingMqttDto>;
  mappingMssqls?: Array<MappingMssqlDto>;
  mappingOpcuas?: Array<MappingOpcuaDto>;
  mappingOracles?: Array<MappingOracleDto>;
  mappingRestApis?: Array<MappingRestApiDto>;
  mappingSharePoints?: Array<MappingSharePointDto>;
  sourceSinkFileMappings?: Array<SourceSinkFileMappingDto>;
  sourceSinkModbusMappings?: Array<SourceSinkModbusMappingDto>;
  sourceSinkMqttMappings?: Array<SourceSinkMqttMappingDto>;
  sourceSinkOpcMappings?: Array<SourceSinkOpcMappingDto>;
  sourceSinkRdbMappings?: Array<SourceSinkRdbMappingDto>;
  sourceSinkRestApiMappings?: Array<SourceSinkRestApiMappingDto>;
};

