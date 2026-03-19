/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CoreEventCreateRequest } from '../models/CoreEventCreateRequest';
import type { CoreEventDtoApiResponse } from '../models/CoreEventDtoApiResponse';
import type { CoreEventDtoPagedResultApiResponse } from '../models/CoreEventDtoPagedResultApiResponse';
import type { CoreEventUpdateRequest } from '../models/CoreEventUpdateRequest';
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EventService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns CoreEventDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getEvent({
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
  }): CancelablePromise<CoreEventDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/event',
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
  public createEvent({
    body,
  }: {
    body?: CoreEventCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/event',
      body: body,
    });
  }
  /**
   * @returns CoreEventDtoApiResponse OK
   * @throws ApiError
   */
  public getEventById({
    id,
  }: {
    id: number,
  }): CancelablePromise<CoreEventDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/event/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateEvent({
    id,
    body,
  }: {
    id: number,
    body?: CoreEventUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/event/{id}',
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
  public deleteEvent({
    id,
  }: {
    id: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/event/{id}',
      path: {
        'id': id,
      },
    });
  }
}
