/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceConnectionCreateRequest } from './InterfaceConnectionCreateRequest';
export type InterfaceModbusSerialConnectionCreateRequest = (InterfaceConnectionCreateRequest & {
  serialPort?: string;
  protocolType?: string;
  physicalType?: string;
  parityCheck?: string;
  baudRate?: number;
  dataBit?: number;
  stopBit?: number;
  connectionTime?: number;
  timeout?: number;
});

