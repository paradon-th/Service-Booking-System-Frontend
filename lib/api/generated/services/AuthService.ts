/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResultApiResponse } from '../models/LoginResultApiResponse';
import type { LoginSTARequest } from '../models/LoginSTARequest';
import type { PermissionDtoApiResponse } from '../models/PermissionDtoApiResponse';
import type { PermissionDtoListApiResponse } from '../models/PermissionDtoListApiResponse';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import type { RefreshTokenResultApiResponse } from '../models/RefreshTokenResultApiResponse';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns LoginResultApiResponse OK
   * @throws ApiError
   */
  public login({
    body,
  }: {
    body?: LoginRequest,
  }): CancelablePromise<LoginResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/login',
      body: body,
    });
  }
  /**
   * @returns RefreshTokenResultApiResponse OK
   * @throws ApiError
   */
  public refreshToken({
    body,
  }: {
    body?: RefreshTokenRequest,
  }): CancelablePromise<RefreshTokenResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/refresh-token',
      body: body,
    });
  }
  /**
   * @returns PermissionDtoListApiResponse OK
   * @throws ApiError
   */
  public getUserPermissions(): CancelablePromise<PermissionDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/auth/user-permissions',
    });
  }
  /**
   * @returns PermissionDtoApiResponse OK
   * @throws ApiError
   */
  public checkPermission({
    serviceFuncId,
  }: {
    serviceFuncId: number,
  }): CancelablePromise<PermissionDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/auth/check-permission/{serviceFuncId}',
      path: {
        'serviceFuncId': serviceFuncId,
      },
    });
  }
  /**
   * @returns StringApiResponse OK
   * @throws ApiError
   */
  public generateProviderToken(): CancelablePromise<StringApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/generate-provider-token',
    });
  }
  /**
   * @returns LoginResultApiResponse OK
   * @throws ApiError
   */
  public loginSta({
    body,
  }: {
    body?: LoginSTARequest,
  }): CancelablePromise<LoginResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/login-sta',
      body: body,
    });
  }
}
