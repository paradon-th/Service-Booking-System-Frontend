/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { ExcelColumnDtoListApiResponse } from '../models/ExcelColumnDtoListApiResponse';
import type { SharePointDriveItemDtoApiResponse } from '../models/SharePointDriveItemDtoApiResponse';
import type { SharePointDriveItemDtoListApiResponse } from '../models/SharePointDriveItemDtoListApiResponse';
import type { SharePointGetColumnAllRequest } from '../models/SharePointGetColumnAllRequest';
import type { SharePointGetExcelSheetAllRequest } from '../models/SharePointGetExcelSheetAllRequest';
import type { SharePointGetFileAllRequest } from '../models/SharePointGetFileAllRequest';
import type { SharePointValidateTimeStampRequest } from '../models/SharePointValidateTimeStampRequest';
import type { StringListApiResponse } from '../models/StringListApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SharePointService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns SharePointDriveItemDtoListApiResponse OK
   * @throws ApiError
   */
  public getFileAll({
    body,
  }: {
    body?: SharePointGetFileAllRequest,
  }): CancelablePromise<SharePointDriveItemDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/sharepoint/file-list',
      body: body,
    });
  }
  /**
   * @returns ExcelColumnDtoListApiResponse OK
   * @throws ApiError
   */
  public getColumnAll({
    body,
  }: {
    body?: SharePointGetColumnAllRequest,
  }): CancelablePromise<ExcelColumnDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/sharepoint/get-column-all',
      body: body,
    });
  }
  /**
   * @returns StringListApiResponse OK
   * @throws ApiError
   */
  public getExcelSheetAll({
    body,
  }: {
    body?: SharePointGetExcelSheetAllRequest,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/sharepoint/get-sheet-all',
      body: body,
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public checkTimestampCol({
    body,
  }: {
    body?: SharePointValidateTimeStampRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/sharepoint/validate',
      body: body,
    });
  }
  /**
   * @returns SharePointDriveItemDtoApiResponse OK
   * @throws ApiError
   */
  public uploadFileInterface({
    file,
    folderPath,
    id,
    siteUrl,
    tenant,
    clientId,
    clientSecret,
    createAt,
    updateAt,
    deleteAt,
  }: {
    file?: Blob,
    folderPath?: string,
    id?: number,
    siteUrl?: string,
    tenant?: string,
    clientId?: string,
    clientSecret?: string,
    createAt?: string,
    updateAt?: string,
    deleteAt?: string,
  }): CancelablePromise<SharePointDriveItemDtoApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/sharepoint/uploadfile',
      formData: {
        'file': file,
        'folderPath': folderPath,
        'id': id,
        'siteUrl': siteUrl,
        'tenant': tenant,
        'clientId': clientId,
        'clientSecret': clientSecret,
        'createAt': createAt,
        'updateAt': updateAt,
        'deleteAt': deleteAt,
      },
    });
  }
}
