/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModbusTCPReadValueRequest } from '../models/ModbusTCPReadValueRequest';
import type { ModbusTCPResultApiResponse } from '../models/ModbusTCPResultApiResponse';
import type { ModbusTCPResultListApiResponse } from '../models/ModbusTCPResultListApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ModbusTcpService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns ModbusTCPResultApiResponse OK
   * @throws ApiError
   */
  public getModbusTcpReadValue({
    interfaceId,
    modbusType,
    modbusTcpFunction,
    modbusTcpAddress,
  }: {
    interfaceId?: number,
    modbusType?: string,
    modbusTcpFunction?: string,
    modbusTcpAddress?: string,
  }): CancelablePromise<ModbusTCPResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/modbus-tcp/read-single-value',
      query: {
        'interfaceId': interfaceId,
        'modbusType': modbusType,
        'modbusTCPFunction': modbusTcpFunction,
        'modbusTCPAddress': modbusTcpAddress,
      },
    });
  }
  /**
   * @returns ModbusTCPResultListApiResponse OK
   * @throws ApiError
   */
  public getModbusTcpReadMultipleValue({
    body,
  }: {
    body?: Array<ModbusTCPReadValueRequest>,
  }): CancelablePromise<ModbusTCPResultListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/modbus-tcp/read-multiple-value',
      body: body,
    });
  }
  /**
   * @returns ModbusTCPResultApiResponse OK
   * @throws ApiError
   */
  public getModbusTcpWriteValue({
    interfaceId,
    modbusTcpFunction,
    modbusTcpAddress,
    modbusTcpValue,
  }: {
    interfaceId?: number,
    modbusTcpFunction?: string,
    modbusTcpAddress?: string,
    modbusTcpValue?: string,
  }): CancelablePromise<ModbusTCPResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/modbus-tcp/write-single-value',
      query: {
        'interfaceId': interfaceId,
        'modbusTCPFunction': modbusTcpFunction,
        'modbusTCPAddress': modbusTcpAddress,
        'modbusTCPValue': modbusTcpValue,
      },
    });
  }
}
