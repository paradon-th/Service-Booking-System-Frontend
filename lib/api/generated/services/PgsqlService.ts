/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { PGSQLSingleQueryRequest } from '../models/PGSQLSingleQueryRequest';
import type { PGSQLSingleQueryResultApiResponse } from '../models/PGSQLSingleQueryResultApiResponse';
import type { PGSQLTypeQueryResultApiResponse } from '../models/PGSQLTypeQueryResultApiResponse';
import type { StringListApiResponse } from '../models/StringListApiResponse';
import type { StringObjectDictionaryApiResponse } from '../models/StringObjectDictionaryApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PgsqlService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns PGSQLSingleQueryResultApiResponse OK
   * @throws ApiError
   */
  public readSingleRecord({
    body,
  }: {
    body?: PGSQLSingleQueryRequest,
  }): CancelablePromise<PGSQLSingleQueryResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/pgsql/read-single',
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
    body?: PGSQLSingleQueryRequest,
  }): CancelablePromise<StringObjectDictionaryApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/pgsql/read-single-all',
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
    body?: PGSQLSingleQueryRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/pgsql/insert-single',
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
    body?: PGSQLSingleQueryRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/pgsql/get-table-all',
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
    body?: PGSQLSingleQueryRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/pgsql/get-column-all',
      body: body,
    });
  }
  /**
   * @returns PGSQLTypeQueryResultApiResponse OK
   * @throws ApiError
   */
  public getTypeByColumn({
    body,
  }: {
    body?: PGSQLSingleQueryRequest,
  }): CancelablePromise<PGSQLTypeQueryResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/pgsql/get-type-column',
      body: body,
    });
  }
}
