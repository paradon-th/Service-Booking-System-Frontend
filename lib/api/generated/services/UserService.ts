/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordBySecretKeyRequest } from '../models/ChangePasswordBySecretKeyRequest';
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { VerifyChangePasswordSecretKeyRequest } from '../models/VerifyChangePasswordSecretKeyRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UserService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public changePassword({
    body,
  }: {
    body?: ChangePasswordRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/user/change-password',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public requestChangePassword({
    body,
  }: {
    body?: ForgotPasswordRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/user/request-change-password',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public verifyChangePasswordSecretKey({
    body,
  }: {
    body?: VerifyChangePasswordSecretKeyRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/user/verify-change-password',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public changePasswordBySecretKey({
    body,
  }: {
    body?: ChangePasswordBySecretKeyRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/user/change-password-by-secret-key',
      body: body,
    });
  }
}
