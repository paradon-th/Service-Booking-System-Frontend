/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { ServiceFunctionDtoListApiResponse } from '../models/ServiceFunctionDtoListApiResponse';
import type { ServiceMainDtoListApiResponse } from '../models/ServiceMainDtoListApiResponse';
import type { UserCreateRequest } from '../models/UserCreateRequest';
import type { UserDtoApiResponse } from '../models/UserDtoApiResponse';
import type { UserDtoPagedResultApiResponse } from '../models/UserDtoPagedResultApiResponse';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SecurityService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns UserDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getUserByPaging({
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
  }): CancelablePromise<UserDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/security/user',
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
  public createUser({
    body,
  }: {
    body?: UserCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/security/user',
      body: body,
    });
  }
  /**
   * @returns UserDtoApiResponse OK
   * @throws ApiError
   */
  public getUserByUserId({
    userId,
  }: {
    userId: number,
  }): CancelablePromise<UserDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/security/user/{userId}',
      path: {
        'userId': userId,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateUser({
    userId,
    body,
  }: {
    userId: number,
    body?: UserUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/security/user/{userId}',
      path: {
        'userId': userId,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteUser({
    userId,
  }: {
    userId: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/security/user/{userId}',
      path: {
        'userId': userId,
      },
    });
  }
  /**
   * @returns ServiceMainDtoListApiResponse OK
   * @throws ApiError
   */
  public getServiceMainAll(): CancelablePromise<ServiceMainDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/security/service-main',
    });
  }
  /**
   * @returns ServiceFunctionDtoListApiResponse OK
   * @throws ApiError
   */
  public getServiceFunctionAll(): CancelablePromise<ServiceFunctionDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/security/service-function',
    });
  }
}
