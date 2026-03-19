/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModbusSerialResultApiResponse } from '../models/ModbusSerialResultApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ModbusSerialService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns ModbusSerialResultApiResponse OK
   * @throws ApiError
   */
  public getModbusSerialReadValue({
    interfaceId,
    modbusType,
    modbusSerialFunction,
    modbusSerialAddress,
  }: {
    interfaceId?: number,
    modbusType?: string,
    modbusSerialFunction?: string,
    modbusSerialAddress?: string,
  }): CancelablePromise<ModbusSerialResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/modbus-serial/read-single-value',
      query: {
        'interfaceId': interfaceId,
        'modbusType': modbusType,
        'modbusSerialFunction': modbusSerialFunction,
        'modbusSerialAddress': modbusSerialAddress,
      },
    });
  }
  /**
   * @returns ModbusSerialResultApiResponse OK
   * @throws ApiError
   */
  public getModbusSerialWriteValue({
    interfaceId,
    modbusSerialFunction,
    modbusSerialAddress,
    modbusSerialValue,
  }: {
    interfaceId?: number,
    modbusSerialFunction?: string,
    modbusSerialAddress?: string,
    modbusSerialValue?: string,
  }): CancelablePromise<ModbusSerialResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/interface/modbus-serial/write-single-value',
      query: {
        'interfaceId': interfaceId,
        'modbusSerialFunction': modbusSerialFunction,
        'modbusSerialAddress': modbusSerialAddress,
        'modbusSerialValue': modbusSerialValue,
      },
    });
  }
}
