/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceConnectionUpdateRequest } from './InterfaceConnectionUpdateRequest';
export type InterfaceOpcuaConnectionUpdateRequest = (InterfaceConnectionUpdateRequest & {
  protocolType?: string;
  serverAddress?: string;
  serverPort?: string;
  applicationName?: string;
  securityMode?: string;
  securityPolicy?: string;
  authenticationMode?: string;
  timeout?: number;
});

