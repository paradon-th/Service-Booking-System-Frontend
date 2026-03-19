/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessTokenProviderCreateRequest } from '../models/AccessTokenProviderCreateRequest';
import type { AccessTokenProviderDtoPagedResultApiResponse } from '../models/AccessTokenProviderDtoPagedResultApiResponse';
import type { AccessTokenProviderUpdateRequest } from '../models/AccessTokenProviderUpdateRequest';
import type { GenerateProviderTokenRequest } from '../models/GenerateProviderTokenRequest';
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProviderService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns AccessTokenProviderDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getTokenProviderByPaging({
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
  }): CancelablePromise<AccessTokenProviderDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/provider',
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
  public createAccessTokenProvider({
    body,
  }: {
    body?: AccessTokenProviderCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/provider',
      body: body,
    });
  }
  /**
   * @returns StringApiResponse OK
   * @throws ApiError
   */
  public generateAccessTokenProvider({
    body,
  }: {
    body?: GenerateProviderTokenRequest,
  }): CancelablePromise<StringApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/provider/generate-provider-token',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateAccessTokenProvider({
    accessTokenProviderId,
    body,
  }: {
    accessTokenProviderId: number,
    body?: AccessTokenProviderUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/provider/{accessTokenProviderId}',
      path: {
        'accessTokenProviderId': accessTokenProviderId,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteAccessTokenProvider({
    accessTokenProviderId,
  }: {
    accessTokenProviderId: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/provider/{accessTokenProviderId}',
      path: {
        'accessTokenProviderId': accessTokenProviderId,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public refreshAccessTokenProvider({
    accessTokenProviderId,
  }: {
    accessTokenProviderId: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/provider/refresh-token/{accessTokenProviderId}',
      path: {
        'accessTokenProviderId': accessTokenProviderId,
      },
    });
  }
}
