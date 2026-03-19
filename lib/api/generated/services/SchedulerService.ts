/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CoreSchedulerCreateRequest } from '../models/CoreSchedulerCreateRequest';
import type { CoreSchedulerDtoApiResponse } from '../models/CoreSchedulerDtoApiResponse';
import type { CoreSchedulerDtoPagedResultApiResponse } from '../models/CoreSchedulerDtoPagedResultApiResponse';
import type { CoreSchedulerUpdateRequest } from '../models/CoreSchedulerUpdateRequest';
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SchedulerService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns CoreSchedulerDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getScheduler({
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    filters,
  }: {
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
    filters?: string,
  }): CancelablePromise<CoreSchedulerDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/scheduler',
      query: {
        'page': page,
        'pageSize': pageSize,
        'searchTerm': searchTerm,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
        'filters': filters,
      },
    });
  }
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public createScheduler({
    body,
  }: {
    body?: CoreSchedulerCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/scheduler',
      body: body,
    });
  }
  /**
   * @returns CoreSchedulerDtoApiResponse OK
   * @throws ApiError
   */
  public getSchedulerById({
    id,
  }: {
    id: number,
  }): CancelablePromise<CoreSchedulerDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/scheduler/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateScheduler({
    id,
    body,
  }: {
    id: number,
    body?: CoreSchedulerUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/scheduler/{id}',
      path: {
        'id': id,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteScheduler({
    id,
  }: {
    id: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/scheduler/{id}',
      path: {
        'id': id,
      },
    });
  }
}
