/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupCreateRequest } from '../models/GroupCreateRequest';
import type { GroupDtoApiResponse } from '../models/GroupDtoApiResponse';
import type { GroupDtoPagedResultApiResponse } from '../models/GroupDtoPagedResultApiResponse';
import type { GroupUpdateRequest } from '../models/GroupUpdateRequest';
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class GroupService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns GroupDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getGroupByPaging({
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
  }): CancelablePromise<GroupDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/group',
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
  public createGroup({
    body,
  }: {
    body?: GroupCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/group',
      body: body,
    });
  }
  /**
   * @returns GroupDtoApiResponse OK
   * @throws ApiError
   */
  public getGroupById({
    id,
  }: {
    id: number,
  }): CancelablePromise<GroupDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/group/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateGroup({
    id,
    body,
  }: {
    id: number,
    body?: GroupUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/group/{id}',
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
  public deleteById({
    id,
  }: {
    id: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/group/{id}',
      path: {
        'id': id,
      },
    });
  }
}
