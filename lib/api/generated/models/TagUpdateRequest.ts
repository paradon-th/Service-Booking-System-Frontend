/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceTypeEnum } from './InterfaceTypeEnum';
import type { TagUpdateDataPermissionItem } from './TagUpdateDataPermissionItem';
import type { TagUpdatePermissionItem } from './TagUpdatePermissionItem';
export type TagUpdateRequest = {
  tagId?: number;
  tagName?: string;
  description?: string;
  subDescription?: string;
  tagMode?: string;
  unit?: string;
  periodUnit?: string;
  periodValue?: number;
  conditionOperator?: string;
  conditionValue?: string;
  equation?: string;
  interfaceId?: number;
  interfaceType?: InterfaceTypeEnum;
  modbusType?: string;
  modbusTcpfunction?: string;
  modbusTcpaddress?: string;
  opcDaItemId?: string;
  opcUaNameSpace?: string;
  opcUaIdentifierType?: string;
  opcUaIdentifier?: string;
  tagPermissions?: Array<TagUpdatePermissionItem>;
  tagDataPermissions?: Array<TagUpdateDataPermissionItem>;
};

