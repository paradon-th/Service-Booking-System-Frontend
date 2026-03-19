/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CoreEventDtoApiResponse } from '../models/CoreEventDtoApiResponse';
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { TagCreateRequest } from '../models/TagCreateRequest';
import type { TagDtoPagedResultApiResponse } from '../models/TagDtoPagedResultApiResponse';
import type { TagUpdateRequest } from '../models/TagUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TagService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns TagDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getTag({
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
  }): CancelablePromise<TagDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag',
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
  public createTag({
    body,
  }: {
    body?: TagCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag',
      body: body,
    });
  }
  /**
   * @returns CoreEventDtoApiResponse OK
   * @throws ApiError
   */
  public getTagById({
    id,
  }: {
    id: number,
  }): CancelablePromise<CoreEventDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateTag({
    id,
    body,
  }: {
    id: number,
    body?: TagUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/tag/{id}',
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
  public deleteTag({
    id,
  }: {
    id: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/tag/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns CoreEventDtoApiResponse OK
   * @throws ApiError
   */
  public getTagPermissionCheckById({
    id,
  }: {
    id: number,
  }): CancelablePromise<CoreEventDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag/{id}/permission-check',
      path: {
        'id': id,
      },
    });
  }
}
