/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { TagRelationCreateRequest } from '../models/TagRelationCreateRequest';
import type { TagRelationDtoApiResponse } from '../models/TagRelationDtoApiResponse';
import type { TagRelationDtoPagedResultApiResponse } from '../models/TagRelationDtoPagedResultApiResponse';
import type { TagRelationPermissionCheckDtoApiResponse } from '../models/TagRelationPermissionCheckDtoApiResponse';
import type { TagRelationUpdateRequest } from '../models/TagRelationUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TagRelationService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns TagRelationDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getTagRelation({
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
  }): CancelablePromise<TagRelationDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation',
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
  public createTagRelation({
    body,
  }: {
    body?: TagRelationCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation',
      body: body,
    });
  }
  /**
   * @returns TagRelationDtoApiResponse OK
   * @throws ApiError
   */
  public getTagRelationById({
    id,
  }: {
    id: number,
  }): CancelablePromise<TagRelationDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateTagRelation({
    id,
    body,
  }: {
    id: number,
    body?: TagRelationUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/tag-relation/{id}',
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
  public deleteTagRelation({
    id,
  }: {
    id: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/tag-relation/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns TagRelationDtoApiResponse OK
   * @throws ApiError
   */
  public getTagRelationByName({
    name,
  }: {
    name: string,
  }): CancelablePromise<TagRelationDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation/name/{name}',
      path: {
        'name': name,
      },
    });
  }
  /**
   * @returns TagRelationPermissionCheckDtoApiResponse OK
   * @throws ApiError
   */
  public getTagPermissionCheckById({
    id,
  }: {
    id: number,
  }): CancelablePromise<TagRelationPermissionCheckDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation/{id}/permission-check',
      path: {
        'id': id,
      },
    });
  }
}
