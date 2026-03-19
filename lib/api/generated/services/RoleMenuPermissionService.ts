/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { MenuDtoListApiResponse } from '../models/MenuDtoListApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { RoleMenuPermissionCreateRequest } from '../models/RoleMenuPermissionCreateRequest';
import type { RoleMenuPermissionDtoApiResponse } from '../models/RoleMenuPermissionDtoApiResponse';
import type { RoleMenuPermissionDtoListApiResponse } from '../models/RoleMenuPermissionDtoListApiResponse';
import type { RoleMenuPermissionDtoPagedResultApiResponse } from '../models/RoleMenuPermissionDtoPagedResultApiResponse';
import type { RoleMenuPermissionUpdateRequest } from '../models/RoleMenuPermissionUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RoleMenuPermissionService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns MenuDtoListApiResponse OK
   * @throws ApiError
   */
  public getMenuAll(): CancelablePromise<MenuDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/role-menu-permission/menu',
    });
  }
  /**
   * @returns RoleMenuPermissionDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getRoleMenuPermissionByPaging({
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
  }): CancelablePromise<RoleMenuPermissionDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/role-menu-permission',
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
  public createRoleMenuPermission({
    body,
  }: {
    body?: RoleMenuPermissionCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/role-menu-permission',
      body: body,
    });
  }
  /**
   * @returns RoleMenuPermissionDtoApiResponse OK
   * @throws ApiError
   */
  public getRoleMenuPermissionById({
    id,
  }: {
    id: number,
  }): CancelablePromise<RoleMenuPermissionDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/role-menu-permission/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateRoleMenuPermission({
    id,
    body,
  }: {
    id: number,
    body?: RoleMenuPermissionUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/role-menu-permission/{id}',
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
      url: '/api/role-menu-permission/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns RoleMenuPermissionDtoListApiResponse OK
   * @throws ApiError
   */
  public getRoleMenuPermissionByRoleId({
    roleId,
  }: {
    roleId: number,
  }): CancelablePromise<RoleMenuPermissionDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/role-menu-permission/filter-by-role/{roleId}',
      path: {
        'roleId': roleId,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public bulkCreateRoleMenuPermission({
    body,
  }: {
    body?: Array<RoleMenuPermissionCreateRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/role-menu-permission/bulk',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public bulkUpdateRoleMenuPermission({
    body,
  }: {
    body?: Array<RoleMenuPermissionUpdateRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/role-menu-permission/bulk',
      body: body,
    });
  }
}
