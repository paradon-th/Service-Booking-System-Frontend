/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceConnectionCreateRequest } from './InterfaceConnectionCreateRequest';
export type InterfaceModbusTcpConnectionCreateRequest = (InterfaceConnectionCreateRequest & {
  ipType?: string;
  ipAddress?: string;
  port?: string;
  unitId?: number;
  connectionTime?: number;
  timeout?: number;
});

