/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceConnectionConnectRequest } from './InterfaceConnectionConnectRequest';
export type DatabaseConnectRequest = (InterfaceConnectionConnectRequest & {
  interfaceType?: string;
  databaseName?: string;
  databaseTypeId?: number;
  host?: string;
  port?: string;
  authenTypeId?: number;
  username?: string;
  password?: string;
});

