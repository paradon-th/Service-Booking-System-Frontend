/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MYSQLSingleQueryRequest } from '../models/MYSQLSingleQueryRequest';
import type { MYSQLSingleQueryResultApiResponse } from '../models/MYSQLSingleQueryResultApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { StringListApiResponse } from '../models/StringListApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MysqlService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns MYSQLSingleQueryResultApiResponse OK
   * @throws ApiError
   */
  public readSingleRecord({
    body,
  }: {
    body?: MYSQLSingleQueryRequest,
  }): CancelablePromise<MYSQLSingleQueryResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mysql/read-single',
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
    body?: MYSQLSingleQueryRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mysql/insert-single',
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
    body?: MYSQLSingleQueryRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mysql/get-table-all',
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
    body?: MYSQLSingleQueryRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mysql/get-column-all',
      body: body,
    });
  }
}
