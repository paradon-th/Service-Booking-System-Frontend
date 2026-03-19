/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { MSSQLSingleQueryRequest } from '../models/MSSQLSingleQueryRequest';
import type { MSSQLSingleQueryResultApiResponse } from '../models/MSSQLSingleQueryResultApiResponse';
import type { MSSQLTableColumnDtoListApiResponse } from '../models/MSSQLTableColumnDtoListApiResponse';
import type { MSSQLTestInsertConfigRequest } from '../models/MSSQLTestInsertConfigRequest';
import type { MSSQLTypeQueryResultApiResponse } from '../models/MSSQLTypeQueryResultApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { StringListApiResponse } from '../models/StringListApiResponse';
import type { StringObjectDictionaryApiResponse } from '../models/StringObjectDictionaryApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MssqlService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns MSSQLSingleQueryResultApiResponse OK
   * @throws ApiError
   */
  public readSingleRecord({
    body,
  }: {
    body?: MSSQLSingleQueryRequest,
  }): CancelablePromise<MSSQLSingleQueryResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mssql/read-single',
      body: body,
    });
  }
  /**
   * @returns StringObjectDictionaryApiResponse OK
   * @throws ApiError
   */
  public readSingleRecordAll({
    body,
  }: {
    body?: MSSQLSingleQueryRequest,
  }): CancelablePromise<StringObjectDictionaryApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mssql/read-single-all',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public insertSingleRecord({
    body,
  }: {
    body?: MSSQLSingleQueryRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mssql/insert-single',
      body: body,
    });
  }
  /**
   * @returns StringListApiResponse OK
   * @throws ApiError
   */
  public getTableAll({
    body,
  }: {
    body?: MSSQLSingleQueryRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mssql/get-table-all',
      body: body,
    });
  }
  /**
   * @returns StringListApiResponse OK
   * @throws ApiError
   */
  public getColumnAll({
    body,
  }: {
    body?: MSSQLSingleQueryRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mssql/get-column-all',
      body: body,
    });
  }
  /**
   * @returns MSSQLTableColumnDtoListApiResponse OK
   * @throws ApiError
   */
  public getTableColumnAll({
    body,
  }: {
    body?: MSSQLSingleQueryRequest,
  }): CancelablePromise<MSSQLTableColumnDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mssql/get-table-column-all',
      body: body,
    });
  }
  /**
   * @returns MSSQLTypeQueryResultApiResponse OK
   * @throws ApiError
   */
  public getTypeByColumn({
    body,
  }: {
    body?: MSSQLSingleQueryRequest,
  }): CancelablePromise<MSSQLTypeQueryResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mssql/get-type-column',
      body: body,
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public insertSingleRecordTest({
    body,
  }: {
    body?: MSSQLTestInsertConfigRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mssql/insert-single/validate',
      body: body,
    });
  }
}
