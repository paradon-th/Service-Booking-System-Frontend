/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { ExcelColumnDtoListApiResponse } from '../models/ExcelColumnDtoListApiResponse';
import type { FileSystemReadFileRequest } from '../models/FileSystemReadFileRequest';
import type { FileSystemValidateTimeStampRequest } from '../models/FileSystemValidateTimeStampRequest';
import type { StringListApiResponse } from '../models/StringListApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FileSystemService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns StringListApiResponse OK
   * @throws ApiError
   */
  public getFileAll({
    body,
  }: {
    body?: FileSystemReadFileRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/file-system/file-list',
      body: body,
    });
  }
  /**
   * @returns ExcelColumnDtoListApiResponse OK
   * @throws ApiError
   */
  public getColumnAll({
    body,
  }: {
    body?: FileSystemReadFileRequest,
  }): CancelablePromise<ExcelColumnDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/file-system/column-all',
      body: body,
    });
  }
  /**
   * @returns StringListApiResponse OK
   * @throws ApiError
   */
  public getExcelSheetAll({
    body,
  }: {
    body?: FileSystemReadFileRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/file-system/shett-all',
      body: body,
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public checkTimestampCol({
    body,
  }: {
    body?: FileSystemValidateTimeStampRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/file-system/validate',
      body: body,
    });
  }
}
