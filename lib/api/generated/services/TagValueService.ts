/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { TagValueCreateRequest } from '../models/TagValueCreateRequest';
import type { TagValueDeleteRequest } from '../models/TagValueDeleteRequest';
import type { TagValueDtoApiResponse } from '../models/TagValueDtoApiResponse';
import type { TagValueDtoListApiResponse } from '../models/TagValueDtoListApiResponse';
import type { TagValueDtoPagedResultApiResponse } from '../models/TagValueDtoPagedResultApiResponse';
import type { TagValueUpdateRequest } from '../models/TagValueUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TagValueService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns TagValueDtoListApiResponse OK
   * @throws ApiError
   */
  public getAllSingleTagValue({
    xServiceMainId,
  }: {
    xServiceMainId?: number,
  }): CancelablePromise<TagValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tagvalue/single-tag-value/all',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
    });
  }
  /**
   * @returns TagValueDtoListApiResponse OK
   * @throws ApiError
   */
  public getSingleTagValue({
    id,
    tagName,
    startTime,
    endTime,
    time,
    limit,
    sort,
    query,
    xServiceMainId,
  }: {
    id?: number,
    tagName?: string,
    startTime?: string,
    endTime?: string,
    time?: string,
    limit?: string,
    sort?: string,
    query?: string,
    xServiceMainId?: number,
  }): CancelablePromise<TagValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tagvalue/single-tag-value',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'id': id,
        'tagName': tagName,
        'startTime': startTime,
        'endTime': endTime,
        'time': time,
        'limit': limit,
        'sort': sort,
        'query': query,
      },
    });
  }
  /**
   * @returns TagValueDtoApiResponse OK
   * @throws ApiError
   */
  public createSingleTagValue({
    xServiceMainId,
    body,
  }: {
    xServiceMainId?: number,
    body?: TagValueCreateRequest,
  }): CancelablePromise<TagValueDtoApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tagvalue/single-tag-value',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      body: body,
    });
  }
  /**
   * @returns TagValueDtoApiResponse OK
   * @throws ApiError
   */
  public updateSingleTagValue({
    body,
  }: {
    body?: TagValueUpdateRequest,
  }): CancelablePromise<TagValueDtoApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/tagvalue/single-tag-value',
      body: body,
    });
  }
  /**
   * @returns TagValueDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getSingleTagValueByPaginate({
    id,
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    filters,
    xServiceMainId,
  }: {
    id: number,
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
    filters?: string,
    xServiceMainId?: number,
  }): CancelablePromise<TagValueDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tagvalue/single-tag-value/{id}/paginate',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
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
   * @returns TagValueDtoListApiResponse OK
   * @throws ApiError
   */
  public getSingleValueDistinct({
    id,
    tagname,
    starttime,
    endtime,
    xServiceMainId,
  }: {
    id?: number,
    tagname?: string,
    starttime?: string,
    endtime?: string,
    xServiceMainId?: number,
  }): CancelablePromise<TagValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tagvalue/single-tag-value/distinct',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'id': id,
        'tagname': tagname,
        'starttime': starttime,
        'endtime': endtime,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteSingleTagValue({
    body,
  }: {
    body?: TagValueDeleteRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tagvalue/single-tag-value/delete',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteMultipleTagValue({
    body,
  }: {
    body?: Array<TagValueDeleteRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tagvalue/multiple-tag-value/delete',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteMultipleTagValueTimeRange({
    id,
    startTime,
    endTime,
  }: {
    id?: number,
    startTime?: string,
    endTime?: string,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/tagvalue/multiple-tag-value/delete-by-time-range',
      query: {
        'id': id,
        'startTime': startTime,
        'endTime': endTime,
      },
    });
  }
  /**
   * @returns TagValueDtoListApiResponse OK
   * @throws ApiError
   */
  public getMultipleTagValue({
    id,
    starttime,
    endtime,
    time,
    query,
    xServiceMainId,
  }: {
    id?: Array<number>,
    starttime?: string,
    endtime?: string,
    time?: string,
    query?: string,
    xServiceMainId?: number,
  }): CancelablePromise<TagValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tagvalue/multiple-tag-value',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'id': id,
        'starttime': starttime,
        'endtime': endtime,
        'time': time,
        'query': query,
      },
    });
  }
  /**
   * @returns TagValueDtoListApiResponse OK
   * @throws ApiError
   */
  public createMultipleTagValue({
    xServiceMainId,
    clearAll = false,
    body,
  }: {
    xServiceMainId?: number,
    clearAll?: boolean,
    body?: Array<TagValueCreateRequest>,
  }): CancelablePromise<TagValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tagvalue/multiple-tag-value',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'clearAll': clearAll,
      },
      body: body,
    });
  }
  /**
   * @returns TagValueDtoListApiResponse OK
   * @throws ApiError
   */
  public updateMultipleTagValue({
    body,
  }: {
    body?: Array<TagValueUpdateRequest>,
  }): CancelablePromise<TagValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/tagvalue/multiple-tag-value',
      body: body,
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public createMultipleTagValueTest({
    xServiceMainId,
    removeAfter = false,
    body,
  }: {
    xServiceMainId?: number,
    removeAfter?: boolean,
    body?: Array<TagValueCreateRequest>,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tagvalue/multiple-tag-value/test',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'removeAfter': removeAfter,
      },
      body: body,
    });
  }
  /**
   * @returns StringApiResponse OK
   * @throws ApiError
   */
  public evaluateCalculationValue({
    body,
  }: {
    body?: string,
  }): CancelablePromise<StringApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tagvalue/evaluate-cal-value',
      body: body,
    });
  }
}
