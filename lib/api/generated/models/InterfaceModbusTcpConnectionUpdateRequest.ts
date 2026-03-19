/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceConnectionUpdateRequest } from './InterfaceConnectionUpdateRequest';
export type InterfaceModbusTcpConnectionUpdateRequest = (InterfaceConnectionUpdateRequest & {
  ipType?: string;
  ipAddress?: string;
  port?: string;
  unitId?: number;
  connectionTime?: number;
  timeout?: number;
});

