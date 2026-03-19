/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OpcUaReadValueRequest } from '../models/OpcUaReadValueRequest';
import type { OpcUaResultApiResponse } from '../models/OpcUaResultApiResponse';
import type { OpcUaResultListApiResponse } from '../models/OpcUaResultListApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OpcUaService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns OpcUaResultApiResponse OK
   * @throws ApiError
   */
  public getOpcUaReadValue({
    interfaceId,
    opcUaNameSpace,
    opcUaIdentifierType,
    opcUaIdentifier,
  }: {
    interfaceId?: number,
    opcUaNameSpace?: string,
    opcUaIdentifierType?: string,
    opcUaIdentifier?: string,
  }): CancelablePromise<OpcUaResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/opc-ua/read-single-value',
      query: {
        'interfaceId': interfaceId,
        'opcUaNameSpace': opcUaNameSpace,
        'opcUaIdentifierType': opcUaIdentifierType,
        'opcUaIdentifier': opcUaIdentifier,
      },
    });
  }
  /**
   * @returns OpcUaResultListApiResponse OK
   * @throws ApiError
   */
  public getOpcUaReadMultipleValue({
    body,
  }: {
    body?: Array<OpcUaReadValueRequest>,
  }): CancelablePromise<OpcUaResultListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/opc-ua/read-multiple-value',
      body: body,
    });
  }
  /**
   * @returns OpcUaResultApiResponse OK
   * @throws ApiError
   */
  public getOpcUaWriteValue({
    interfaceId,
    opcUaNameSpace,
    opcUaIdentifierType,
    opcUaIdentifier,
    value,
  }: {
    interfaceId?: number,
    opcUaNameSpace?: string,
    opcUaIdentifierType?: string,
    opcUaIdentifier?: string,
    value?: string,
  }): CancelablePromise<OpcUaResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/opc-ua/write-single-value',
      query: {
        'interfaceId': interfaceId,
        'opcUaNameSpace': opcUaNameSpace,
        'opcUaIdentifierType': opcUaIdentifierType,
        'opcUaIdentifier': opcUaIdentifier,
        'value': value,
      },
    });
  }
}
