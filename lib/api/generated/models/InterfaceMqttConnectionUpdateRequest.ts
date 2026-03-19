/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceConnectionUpdateRequest } from './InterfaceConnectionUpdateRequest';
export type InterfaceMqttConnectionUpdateRequest = (InterfaceConnectionUpdateRequest & {
  clientId?: string;
  protocol?: string;
  host?: string;
  port?: number;
  authenMode?: string;
  username?: string;
  password?: string;
});

