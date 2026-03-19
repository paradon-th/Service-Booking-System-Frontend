/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { EventService } from './services/EventService';
import { FileSystemService } from './services/FileSystemService';
import { FormPermissionService } from './services/FormPermissionService';
import { GroupService } from './services/GroupService';
import { HealthCheckService } from './services/HealthCheckService';
import { ICubeService } from './services/ICubeService';
import { IntegrationService } from './services/IntegrationService';
import { IntegrationWebApiService } from './services/IntegrationWebApiService';
import { InterfaceService } from './services/InterfaceService';
import { ManagementService } from './services/ManagementService';
import { MappingService } from './services/MappingService';
import { ModbusSerialService } from './services/ModbusSerialService';
import { ModbusTcpService } from './services/ModbusTcpService';
import { MssqlService } from './services/MssqlService';
import { MysqlService } from './services/MysqlService';
import { OpcDaService } from './services/OpcDaService';
import { OpcUaService } from './services/OpcUaService';
import { OracleService } from './services/OracleService';
import { PgsqlService } from './services/PgsqlService';
import { ProviderService } from './services/ProviderService';
import { RestApiService } from './services/RestApiService';
import { RoleService } from './services/RoleService';
import { RoleMenuPermissionService } from './services/RoleMenuPermissionService';
import { SchedulerService } from './services/SchedulerService';
import { SecurityService } from './services/SecurityService';
import { SharePointService } from './services/SharePointService';
import { TagService } from './services/TagService';
import { TagRelationService } from './services/TagRelationService';
import { TagRelationValueService } from './services/TagRelationValueService';
import { TagValueService } from './services/TagValueService';
import { UploadFileService } from './services/UploadFileService';
import { UserService } from './services/UserService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class icubeApi {
  public readonly auth: AuthService;
  public readonly event: EventService;
  public readonly fileSystem: FileSystemService;
  public readonly formPermission: FormPermissionService;
  public readonly group: GroupService;
  public readonly healthCheck: HealthCheckService;
  public readonly iCube: ICubeService;
  public readonly integration: IntegrationService;
  public readonly integrationWebApi: IntegrationWebApiService;
  public readonly interface: InterfaceService;
  public readonly management: ManagementService;
  public readonly mapping: MappingService;
  public readonly modbusSerial: ModbusSerialService;
  public readonly modbusTcp: ModbusTcpService;
  public readonly mssql: MssqlService;
  public readonly mysql: MysqlService;
  public readonly opcDa: OpcDaService;
  public readonly opcUa: OpcUaService;
  public readonly oracle: OracleService;
  public readonly pgsql: PgsqlService;
  public readonly provider: ProviderService;
  public readonly restApi: RestApiService;
  public readonly role: RoleService;
  public readonly roleMenuPermission: RoleMenuPermissionService;
  public readonly scheduler: SchedulerService;
  public readonly security: SecurityService;
  public readonly sharePoint: SharePointService;
  public readonly tag: TagService;
  public readonly tagRelation: TagRelationService;
  public readonly tagRelationValue: TagRelationValueService;
  public readonly tagValue: TagValueService;
  public readonly uploadFile: UploadFileService;
  public readonly user: UserService;
  public readonly request: BaseHttpRequest;
  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? '',
      VERSION: config?.VERSION ?? '1',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });
    this.auth = new AuthService(this.request);
    this.event = new EventService(this.request);
    this.fileSystem = new FileSystemService(this.request);
    this.formPermission = new FormPermissionService(this.request);
    this.group = new GroupService(this.request);
    this.healthCheck = new HealthCheckService(this.request);
    this.iCube = new ICubeService(this.request);
    this.integration = new IntegrationService(this.request);
    this.integrationWebApi = new IntegrationWebApiService(this.request);
    this.interface = new InterfaceService(this.request);
    this.management = new ManagementService(this.request);
    this.mapping = new MappingService(this.request);
    this.modbusSerial = new ModbusSerialService(this.request);
    this.modbusTcp = new ModbusTcpService(this.request);
    this.mssql = new MssqlService(this.request);
    this.mysql = new MysqlService(this.request);
    this.opcDa = new OpcDaService(this.request);
    this.opcUa = new OpcUaService(this.request);
    this.oracle = new OracleService(this.request);
    this.pgsql = new PgsqlService(this.request);
    this.provider = new ProviderService(this.request);
    this.restApi = new RestApiService(this.request);
    this.role = new RoleService(this.request);
    this.roleMenuPermission = new RoleMenuPermissionService(this.request);
    this.scheduler = new SchedulerService(this.request);
    this.security = new SecurityService(this.request);
    this.sharePoint = new SharePointService(this.request);
    this.tag = new TagService(this.request);
    this.tagRelation = new TagRelationService(this.request);
    this.tagRelationValue = new TagRelationValueService(this.request);
    this.tagValue = new TagValueService(this.request);
    this.uploadFile = new UploadFileService(this.request);
    this.user = new UserService(this.request);
  }
}

