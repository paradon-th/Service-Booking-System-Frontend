/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ElkLogEntryListApiResponse } from '../models/ElkLogEntryListApiResponse';
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { LivenessStatusDtoListApiResponse } from '../models/LivenessStatusDtoListApiResponse';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class HealthCheckService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns LivenessStatusDtoListApiResponse OK
   * @throws ApiError
   */
  public getServiceLivenessStatuses(): CancelablePromise<LivenessStatusDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/service/status',
    });
  }
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public getTotalApiRequestsByFactory({
    factoryId,
    startTime,
    endTime,
  }: {
    factoryId?: number,
    startTime?: string,
    endTime?: string,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/count',
      query: {
        'factoryId': factoryId,
        'startTime': startTime,
        'endTime': endTime,
      },
    });
  }
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public getTotalApiRequestsByFactory1({
    factoryId,
  }: {
    factoryId: number,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/information/count/{factoryId}',
      path: {
        'factoryId': factoryId,
      },
    });
  }
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public getTotalSuccessfulApiRequestsByFactory({
    factoryId,
  }: {
    factoryId: number,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/successful/count/{factoryId}',
      path: {
        'factoryId': factoryId,
      },
    });
  }
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public getTotalRedirectionApiRequestsByFactory({
    factoryId,
  }: {
    factoryId: number,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/redirection/count/{factoryId}',
      path: {
        'factoryId': factoryId,
      },
    });
  }
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public getTotalClientErrorApiRequestsByFactory({
    factoryId,
  }: {
    factoryId: number,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/client-error/count/{factoryId}',
      path: {
        'factoryId': factoryId,
      },
    });
  }
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public getTotalServerErrorApiRequestsByFactory({
    factoryId,
  }: {
    factoryId: number,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/server-error/count/{factoryId}',
      path: {
        'factoryId': factoryId,
      },
    });
  }
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public getTotalErrorApiRequestsByFactory({
    factoryId,
  }: {
    factoryId: number,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/error/count/{factoryId}',
      path: {
        'factoryId': factoryId,
      },
    });
  }
  /**
   * @returns StringApiResponse OK
   * @throws ApiError
   */
  public getLatency(): CancelablePromise<StringApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/latency',
    });
  }
  /**
   * @returns ElkLogEntryListApiResponse OK
   * @throws ApiError
   */
  public getApplicationLogs({
    startTime,
    endTime,
    limit,
    keyword,
  }: {
    startTime?: string,
    endTime?: string,
    limit?: string,
    keyword?: string,
  }): CancelablePromise<ElkLogEntryListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/logs/application',
      query: {
        'startTime': startTime,
        'endTime': endTime,
        'limit': limit,
        'keyword': keyword,
      },
    });
  }
  /**
   * @returns ElkLogEntryListApiResponse OK
   * @throws ApiError
   */
  public getSystemLogs({
    startTime,
    endTime,
    limit,
    keyword,
  }: {
    startTime?: string,
    endTime?: string,
    limit?: string,
    keyword?: string,
  }): CancelablePromise<ElkLogEntryListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/logs/system',
      query: {
        'startTime': startTime,
        'endTime': endTime,
        'limit': limit,
        'keyword': keyword,
      },
    });
  }
  /**
   * @returns ElkLogEntryListApiResponse OK
   * @throws ApiError
   */
  public getSecurityLogs({
    startTime,
    endTime,
    limit,
    keyword,
  }: {
    startTime?: string,
    endTime?: string,
    limit?: string,
    keyword?: string,
  }): CancelablePromise<ElkLogEntryListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/logs/security',
      query: {
        'startTime': startTime,
        'endTime': endTime,
        'limit': limit,
        'keyword': keyword,
      },
    });
  }
  /**
   * @returns ElkLogEntryListApiResponse OK
   * @throws ApiError
   */
  public getErrorLogs({
    startTime,
    endTime,
    limit,
    keyword,
  }: {
    startTime?: string,
    endTime?: string,
    limit?: string,
    keyword?: string,
  }): CancelablePromise<ElkLogEntryListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/healthcheck/logs/error',
      query: {
        'startTime': startTime,
        'endTime': endTime,
        'limit': limit,
        'keyword': keyword,
      },
    });
  }
}
