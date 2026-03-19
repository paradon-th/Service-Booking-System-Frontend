/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceConnectionCreateRequest } from './InterfaceConnectionCreateRequest';
export type InterfaceOpcuaConnectionCreateRequest = (InterfaceConnectionCreateRequest & {
  endpointUrl?: string;
  protocolType?: string;
  serverAddress?: string;
  serverPort?: string;
  applicationName?: string;
  securityMode?: string;
  securityPolicy?: string;
  authenticationMode?: string;
  connectionTime?: number;
  timeout?: number;
});

