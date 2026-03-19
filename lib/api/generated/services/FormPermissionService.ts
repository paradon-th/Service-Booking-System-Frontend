/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupFormPagePermissionServiceCreateRequest } from '../models/GroupFormPagePermissionServiceCreateRequest';
import type { GroupFormPagePermissionServiceDtoApiResponse } from '../models/GroupFormPagePermissionServiceDtoApiResponse';
import type { GroupFormPagePermissionServiceDtoListApiResponse } from '../models/GroupFormPagePermissionServiceDtoListApiResponse';
import type { GroupFormPagePermissionServiceUpdateRequest } from '../models/GroupFormPagePermissionServiceUpdateRequest';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { RoleFormPagePermissionServiceCreateRequest } from '../models/RoleFormPagePermissionServiceCreateRequest';
import type { RoleFormPagePermissionServiceDtoApiResponse } from '../models/RoleFormPagePermissionServiceDtoApiResponse';
import type { RoleFormPagePermissionServiceDtoListApiResponse } from '../models/RoleFormPagePermissionServiceDtoListApiResponse';
import type { RoleFormPagePermissionServiceUpdateRequest } from '../models/RoleFormPagePermissionServiceUpdateRequest';
import type { UserFormPagePermissionServiceCreateRequest } from '../models/UserFormPagePermissionServiceCreateRequest';
import type { UserFormPagePermissionServiceDtoApiResponse } from '../models/UserFormPagePermissionServiceDtoApiResponse';
import type { UserFormPagePermissionServiceDtoListApiResponse } from '../models/UserFormPagePermissionServiceDtoListApiResponse';
import type { UserFormPagePermissionServiceUpdateRequest } from '../models/UserFormPagePermissionServiceUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FormPermissionService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns UserFormPagePermissionServiceDtoListApiResponse OK
   * @throws ApiError
   */
  public getFormPermissionAll(): CancelablePromise<UserFormPagePermissionServiceDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/form-permission/user',
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public createFormPermission({
    body,
  }: {
    body?: UserFormPagePermissionServiceCreateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/form-permission/user',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateFormPermission({
    body,
  }: {
    body?: UserFormPagePermissionServiceUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/form-permission/user',
      body: body,
    });
  }
  /**
   * @returns UserFormPagePermissionServiceDtoApiResponse OK
   * @throws ApiError
   */
  public getFormPermissionById({
    id,
  }: {
    id: number,
  }): CancelablePromise<UserFormPagePermissionServiceDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/form-permission/user/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteFormPermission({
    id,
  }: {
    id: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/form-permission/user/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns UserFormPagePermissionServiceDtoListApiResponse OK
   * @throws ApiError
   */
  public getFormPermissionByUserId({
    userid,
  }: {
    userid: number,
  }): CancelablePromise<UserFormPagePermissionServiceDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/form-permission/permission-by-user/{userid}',
      path: {
        'userid': userid,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public createFormPermissionRange({
    body,
  }: {
    body?: Array<UserFormPagePermissionServiceCreateRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/form-permission/user/bulk-insert',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateFormPermissionRange({
    body,
  }: {
    body?: Array<UserFormPagePermissionServiceUpdateRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/form-permission/user/bulk-update',
      body: body,
    });
  }
  /**
   * @returns GroupFormPagePermissionServiceDtoListApiResponse OK
   * @throws ApiError
   */
  public getGroupFormPermissionAll(): CancelablePromise<GroupFormPagePermissionServiceDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/form-permission/group',
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public createGroupFormPermission({
    body,
  }: {
    body?: GroupFormPagePermissionServiceCreateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/form-permission/group',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateGroupFormPermission({
    body,
  }: {
    body?: GroupFormPagePermissionServiceUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/form-permission/group',
      body: body,
    });
  }
  /**
   * @returns GroupFormPagePermissionServiceDtoApiResponse OK
   * @throws ApiError
   */
  public getGroupFormPermissionById({
    id,
  }: {
    id: number,
  }): CancelablePromise<GroupFormPagePermissionServiceDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/form-permission/group/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteGroupFormPermission({
    id,
  }: {
    id: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/form-permission/group/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns GroupFormPagePermissionServiceDtoListApiResponse OK
   * @throws ApiError
   */
  public getGroupFormPermissionByGroupId({
    groupId,
  }: {
    groupId: number,
  }): CancelablePromise<GroupFormPagePermissionServiceDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/form-permission/permission-by-group/{groupId}',
      path: {
        'groupId': groupId,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public createGroupFormPermissionRange({
    body,
  }: {
    body?: Array<GroupFormPagePermissionServiceCreateRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/form-permission/group/bulk-insert',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateGroupFormPermissionRange({
    body,
  }: {
    body?: Array<GroupFormPagePermissionServiceUpdateRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/form-permission/group/bulk-update',
      body: body,
    });
  }
  /**
   * @returns RoleFormPagePermissionServiceDtoListApiResponse OK
   * @throws ApiError
   */
  public getRolePermissionAll(): CancelablePromise<RoleFormPagePermissionServiceDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/form-permission/role',
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public createRolePermission({
    body,
  }: {
    body?: RoleFormPagePermissionServiceCreateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/form-permission/role',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateRolePermission({
    body,
  }: {
    body?: RoleFormPagePermissionServiceUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/form-permission/role',
      body: body,
    });
  }
  /**
   * @returns RoleFormPagePermissionServiceDtoApiResponse OK
   * @throws ApiError
   */
  public getRolePermissionById({
    id,
  }: {
    id: number,
  }): CancelablePromise<RoleFormPagePermissionServiceDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/form-permission/role/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteRolePermission({
    id,
  }: {
    id: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/form-permission/role/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns RoleFormPagePermissionServiceDtoListApiResponse OK
   * @throws ApiError
   */
  public getRolePermissionByRoleId({
    roleId,
  }: {
    roleId: number,
  }): CancelablePromise<RoleFormPagePermissionServiceDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/form-permission/permission-by-role/{roleId}',
      path: {
        'roleId': roleId,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public createRolePermissionRange({
    body,
  }: {
    body?: Array<RoleFormPagePermissionServiceCreateRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/form-permission/role/bulk-insert',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateRolePermissionRange({
    body,
  }: {
    body?: Array<RoleFormPagePermissionServiceUpdateRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/form-permission/role/bulk-update',
      body: body,
    });
  }
}
