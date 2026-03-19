/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceConnectionCreateRequest } from './InterfaceConnectionCreateRequest';
export type InterfaceMqttConnectionCreateRequest = (InterfaceConnectionCreateRequest & {
  clientId?: string;
  protocol?: string;
  host?: string;
  port?: number;
  authenMode?: string;
  username?: string;
  password?: string;
});

