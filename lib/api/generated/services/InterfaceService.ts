/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { InterfaceConnectionCreateRequest } from '../models/InterfaceConnectionCreateRequest';
import type { InterfaceConnectionDetailPublicDtoApiResponse } from '../models/InterfaceConnectionDetailPublicDtoApiResponse';
import type { InterfaceConnectionDtoPagedResultApiResponse } from '../models/InterfaceConnectionDtoPagedResultApiResponse';
import type { InterfaceConnectionUpdateRequest } from '../models/InterfaceConnectionUpdateRequest';
import type { InterfaceConnectionValidateDatetimeRequest } from '../models/InterfaceConnectionValidateDatetimeRequest';
import type { ModbusSerialConnectRequest } from '../models/ModbusSerialConnectRequest';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class InterfaceService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public createInterface({
    body,
  }: {
    body?: InterfaceConnectionCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface',
      body: body,
    });
  }
  /**
   * @returns InterfaceConnectionDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getInterfaceConnectionByPaging({
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
  }): CancelablePromise<InterfaceConnectionDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface',
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
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public editInterface({
    body,
  }: {
    body?: InterfaceConnectionUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/interface',
      body: body,
    });
  }
  /**
   * @returns InterfaceConnectionDetailPublicDtoApiResponse OK
   * @throws ApiError
   */
  public getSingleInterfaceConnection({
    interfaceId,
  }: {
    interfaceId: number,
  }): CancelablePromise<InterfaceConnectionDetailPublicDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/{interfaceId}',
      path: {
        'interfaceId': interfaceId,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteInterface({
    interfaceId,
  }: {
    interfaceId: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/interface/{interfaceId}',
      path: {
        'interfaceId': interfaceId,
      },
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public connectInterface({
    body,
  }: {
    body?: ModbusSerialConnectRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/connect',
      body: body,
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public validateDatetime({
    body,
  }: {
    body?: InterfaceConnectionValidateDatetimeRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/validate/datetime',
      body: body,
    });
  }
  /**
   * @returns StringApiResponse OK
   * @throws ApiError
   */
  public getEncryptionPublicKey(): CancelablePromise<StringApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/encryption/public_key',
    });
  }
}
