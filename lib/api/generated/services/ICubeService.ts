/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { ICubeConnectRequest } from '../models/ICubeConnectRequest';
import type { ICubeTestInsertMultipleTagValueRequest } from '../models/ICubeTestInsertMultipleTagValueRequest';
import type { ICubeTestInsertTagRelationValueRequest } from '../models/ICubeTestInsertTagRelationValueRequest';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { ObjectListApiResponse } from '../models/ObjectListApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ICubeService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns ObjectListApiResponse OK
   * @throws ApiError
   */
  public getTagAll({
    body,
  }: {
    body?: ICubeConnectRequest,
  }): CancelablePromise<ObjectListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/icube/tag',
      body: body,
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public insertTagValueTest({
    body,
  }: {
    body?: ICubeTestInsertMultipleTagValueRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/icube/tag/test',
      body: body,
    });
  }
  /**
   * @returns ObjectListApiResponse OK
   * @throws ApiError
   */
  public getTagRelationAll({
    body,
  }: {
    body?: ICubeConnectRequest,
  }): CancelablePromise<ObjectListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/icube/tag-relation',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public getTagRelationByName({
    name,
    body,
  }: {
    name: string,
    body?: ICubeConnectRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/icube/tag-relation/with-name/{name}',
      path: {
        'name': name,
      },
      body: body,
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public insertTagRelationValueTest({
    body,
  }: {
    body?: ICubeTestInsertTagRelationValueRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/icube/tag-relation/test',
      body: body,
    });
  }
}
