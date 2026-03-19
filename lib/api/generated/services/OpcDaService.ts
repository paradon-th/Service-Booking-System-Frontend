/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceOpcdaWriteValueRequest } from '../models/InterfaceOpcdaWriteValueRequest';
import type { OpcDaResultApiResponse } from '../models/OpcDaResultApiResponse';
import type { OpcDaServerListResultListApiResponse } from '../models/OpcDaServerListResultListApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OpcDaService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns OpcDaResultApiResponse OK
   * @throws ApiError
   */
  public getOpcDaReadValue({
    interfaceId,
    opcDaItemId,
  }: {
    interfaceId?: number,
    opcDaItemId?: string,
  }): CancelablePromise<OpcDaResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/opc-da/read-single-value',
      query: {
        'interfaceId': interfaceId,
        'opcDaItemId': opcDaItemId,
      },
    });
  }
  /**
   * @returns OpcDaResultApiResponse OK
   * @throws ApiError
   */
  public getOpcDaWriteValue({
    body,
  }: {
    body?: InterfaceOpcdaWriteValueRequest,
  }): CancelablePromise<OpcDaResultApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/opc-da/write-single-value',
      body: body,
    });
  }
  /**
   * @returns OpcDaServerListResultListApiResponse OK
   * @throws ApiError
   */
  public getOpcDaServerList({
    ipAddress,
    opcdaVersion,
  }: {
    ipAddress?: string,
    opcdaVersion?: number,
  }): CancelablePromise<OpcDaServerListResultListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/opc-da/server-list',
      query: {
        'ipAddress': ipAddress,
        'opcdaVersion': opcdaVersion,
      },
    });
  }
}
