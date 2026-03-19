/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileSystemReadFileRequest } from './FileSystemReadFileRequest';
import type { SourceSinkFileMappingDto } from './SourceSinkFileMappingDto';
export type FileSystemTimeQueryRequest = (FileSystemReadFileRequest & {
  valueCols?: Array<SourceSinkFileMappingDto>;
  timeCol?: string;
  timeColIndex?: number;
  timeColFormat?: string;
  startTime?: string;
  endTime?: string;
  readType?: string;
  templateName?: string;
  templateType?: string;
  dateTimeFormat?: string;
  fileFormat?: string;
  timeStampCol?: string;
  timeStampColIndex?: number;
  timeStampColFormat?: string;
  queryMode?: string;
});

