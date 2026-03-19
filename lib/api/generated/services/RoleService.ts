/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { RoleCreateRequest } from '../models/RoleCreateRequest';
import type { RoleDtoApiResponse } from '../models/RoleDtoApiResponse';
import type { RoleDtoPagedResultApiResponse } from '../models/RoleDtoPagedResultApiResponse';
import type { RoleUpdateRequest } from '../models/RoleUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RoleService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns RoleDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getRoleByPaging({
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
  }): CancelablePromise<RoleDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/role',
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
  public createRole({
    body,
  }: {
    body?: RoleCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/role',
      body: body,
    });
  }
  /**
   * @returns RoleDtoApiResponse OK
   * @throws ApiError
   */
  public getRoleById({
    id,
  }: {
    id: number,
  }): CancelablePromise<RoleDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/role/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateRole({
    id,
    body,
  }: {
    id: number,
    body?: RoleUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/role/{id}',
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
      url: '/api/role/{id}',
      path: {
        'id': id,
      },
    });
  }
}
