/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { MappingSchedulerCreateRequest } from '../models/MappingSchedulerCreateRequest';
import type { MappingSchedulerDetailDtoApiResponse } from '../models/MappingSchedulerDetailDtoApiResponse';
import type { MappingSchedulerDtoPagedResultApiResponse } from '../models/MappingSchedulerDtoPagedResultApiResponse';
import type { MappingSchedulerInsertMappingValueTestRequest } from '../models/MappingSchedulerInsertMappingValueTestRequest';
import type { MappingSchedulerUpdateRequest } from '../models/MappingSchedulerUpdateRequest';
import type { MappingValueResultApiResponse } from '../models/MappingValueResultApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MappingService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns MappingSchedulerDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getMappingSchedulerByPaging({
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
  }): CancelablePromise<MappingSchedulerDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/mapping',
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
  public createMappingScheduler({
    body,
  }: {
    body?: MappingSchedulerCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mapping',
      body: body,
    });
  }
  /**
   * @returns MappingSchedulerDetailDtoApiResponse OK
   * @throws ApiError
   */
  public getMappingSchedulerById({
    mappingId,
  }: {
    mappingId: number,
  }): CancelablePromise<MappingSchedulerDetailDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/mapping/{mappingId}',
      path: {
        'mappingId': mappingId,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public editMappingScheduler({
    mappingId,
    body,
  }: {
    mappingId: number,
    body?: MappingSchedulerUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/interface/mapping/{mappingId}',
      path: {
        'mappingId': mappingId,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteMappingScheduler({
    mappingId,
  }: {
    mappingId: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/interface/mapping/{mappingId}',
      path: {
        'mappingId': mappingId,
      },
    });
  }
  /**
   * @returns MappingValueResultApiResponse OK
   * @throws ApiError
   */
  public getMappingSchedulerValue({
    mappingId,
  }: {
    mappingId: number,
  }): CancelablePromise<MappingValueResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/mapping/value/{mappingId}',
      path: {
        'mappingId': mappingId,
      },
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public insertMappingSchedulerValueTest({
    removeAfter = false,
    body,
  }: {
    removeAfter?: boolean,
    body?: MappingSchedulerInsertMappingValueTestRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/mapping/value/validate',
      query: {
        'removeAfter': removeAfter,
      },
      body: body,
    });
  }
}
