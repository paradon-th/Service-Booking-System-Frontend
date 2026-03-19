/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DbConnectionPublicDto } from './DbConnectionPublicDto';
import type { FileSystemConnectionPublicDto } from './FileSystemConnectionPublicDto';
import type { ICubeConnectionPublicDto } from './ICubeConnectionPublicDto';
import type { InterfaceModbusSerialDto } from './InterfaceModbusSerialDto';
import type { InterfaceModbusTcpDto } from './InterfaceModbusTcpDto';
import type { InterfaceMqttPublicDto } from './InterfaceMqttPublicDto';
import type { InterfaceOpcdaDto } from './InterfaceOpcdaDto';
import type { InterfaceOpcuaDto } from './InterfaceOpcuaDto';
import type { InterfaceRestApiPublicDto } from './InterfaceRestApiPublicDto';
import type { SharePointConnectionPublicDto } from './SharePointConnectionPublicDto';
export type InterfaceConnectionDetailPublicDto = {
  id?: number;
  interfaceName?: string;
  interfaceType?: string;
  interfaceDescription?: string;
  interfaceVersion?: string;
  timeStamp?: string;
  status?: boolean;
  alertState?: boolean;
  alertDescription?: string;
  dbConnections?: Array<DbConnectionPublicDto>;
  fileSystemConnections?: Array<FileSystemConnectionPublicDto>;
  iCubeConnections?: Array<ICubeConnectionPublicDto>;
  interfaceModbusSerials?: Array<InterfaceModbusSerialDto>;
  interfaceModbusTcps?: Array<InterfaceModbusTcpDto>;
  interfaceMqtts?: Array<InterfaceMqttPublicDto>;
  interfaceOpcdas?: Array<InterfaceOpcdaDto>;
  interfaceOpcuas?: Array<InterfaceOpcuaDto>;
  interfaceRestApis?: Array<InterfaceRestApiPublicDto>;
  sharePointConnections?: Array<SharePointConnectionPublicDto>;
};

