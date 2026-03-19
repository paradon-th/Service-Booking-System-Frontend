/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceConnectionCreateRequest } from './InterfaceConnectionCreateRequest';
export type InterfaceDbConnectionCreateRequest = (InterfaceConnectionCreateRequest & {
  databaseName?: string;
  databaseTypeId?: number;
  host?: string;
  port?: string;
  authenTypeId?: number;
  username?: string;
  password?: string;
});

