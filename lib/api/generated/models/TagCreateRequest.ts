/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceTypeEnum } from './InterfaceTypeEnum';
import type { TagCreateDataPermissionItem } from './TagCreateDataPermissionItem';
import type { TagCreatePermissionItem } from './TagCreatePermissionItem';
export type TagCreateRequest = {
  tagName?: string;
  description?: string;
  subDescription?: string;
  tagType?: string;
  tagSource?: string;
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
  tagPermissions?: Array<TagCreatePermissionItem>;
  tagDataPermissions?: Array<TagCreateDataPermissionItem>;
};

