/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OracleSingleQueryRequest } from '../models/OracleSingleQueryRequest';
import type { OracleTypeQueryResultApiResponse } from '../models/OracleTypeQueryResultApiResponse';
import type { StringListApiResponse } from '../models/StringListApiResponse';
import type { StringObjectDictionaryApiResponse } from '../models/StringObjectDictionaryApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OracleService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns StringObjectDictionaryApiResponse OK
   * @throws ApiError
   */
  public readSingleRecord({
    body,
  }: {
    body?: OracleSingleQueryRequest,
  }): CancelablePromise<StringObjectDictionaryApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/oracle/read-single',
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
    body?: OracleSingleQueryRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/oracle/get-table-all',
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
    body?: OracleSingleQueryRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/oracle/get-column-all',
      body: body,
    });
  }
  /**
   * @returns OracleTypeQueryResultApiResponse OK
   * @throws ApiError
   */
  public getTypeByColumn({
    body,
  }: {
    body?: OracleSingleQueryRequest,
  }): CancelablePromise<OracleTypeQueryResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/oracle/get-type-column',
      body: body,
    });
  }
}
