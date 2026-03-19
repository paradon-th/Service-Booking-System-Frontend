/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { ProviderTagApiDtoApiResponse } from '../models/ProviderTagApiDtoApiResponse';
import type { ProviderTagApiDtoPagedResultApiResponse } from '../models/ProviderTagApiDtoPagedResultApiResponse';
import type { ProviderTagRelationApiDtoApiResponse } from '../models/ProviderTagRelationApiDtoApiResponse';
import type { ProviderTagRelationApiDtoPagedResultApiResponse } from '../models/ProviderTagRelationApiDtoPagedResultApiResponse';
import type { TagApiDeleteMultipleTagRelationValuesRequest } from '../models/TagApiDeleteMultipleTagRelationValuesRequest';
import type { TagApiDeleteMultipleTagValuesRequest } from '../models/TagApiDeleteMultipleTagValuesRequest';
import type { TagApiGetMultipleTagRelationValueRequest } from '../models/TagApiGetMultipleTagRelationValueRequest';
import type { TagApiGetMultipleTagValueRequest } from '../models/TagApiGetMultipleTagValueRequest';
import type { TagApiInsertMultipleTagRelationValuesRequest } from '../models/TagApiInsertMultipleTagRelationValuesRequest';
import type { TagApiInsertMultipleTagValuesRequest } from '../models/TagApiInsertMultipleTagValuesRequest';
import type { TagApiTagRelationValueDtoListApiResponse } from '../models/TagApiTagRelationValueDtoListApiResponse';
import type { TagApiTagValueDtoListApiResponse } from '../models/TagApiTagValueDtoListApiResponse';
import type { TagApiTestInsertMultipleTagValuesRequest } from '../models/TagApiTestInsertMultipleTagValuesRequest';
import type { TagApiTestInsertTagRelationValuesRequest } from '../models/TagApiTestInsertTagRelationValuesRequest';
import type { TagApiUpdateMultipleTagRelationValuesRequest } from '../models/TagApiUpdateMultipleTagRelationValuesRequest';
import type { TagApiUpdateMultipleTagValuesRequest } from '../models/TagApiUpdateMultipleTagValuesRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class IntegrationWebApiService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public connect(): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/integration/web-api/connect',
    });
  }
  /**
   * @returns ProviderTagApiDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getTagApiByPaging({
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    filters,
    connectionTimeout,
  }: {
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
    filters?: string,
    connectionTimeout?: number,
  }): CancelablePromise<ProviderTagApiDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/integration/web-api/tag',
      query: {
        'page': page,
        'pageSize': pageSize,
        'searchTerm': searchTerm,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
        'filters': filters,
        'connectionTimeout': connectionTimeout,
      },
    });
  }
  /**
   * @returns ProviderTagApiDtoApiResponse OK
   * @throws ApiError
   */
  public getTagApiByTagName({
    tagName,
    connectionTimeout,
  }: {
    tagName: string,
    connectionTimeout?: number,
  }): CancelablePromise<ProviderTagApiDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/integration/web-api/tag/{tagName}',
      path: {
        'tagName': tagName,
      },
      query: {
        'connectionTimeout': connectionTimeout,
      },
    });
  }
  /**
   * @returns TagApiTagValueDtoListApiResponse OK
   * @throws ApiError
   */
  public getSingleTagValue({
    tagName,
    startTime,
    endTime,
    query,
    connectionTimeout,
  }: {
    tagName: string,
    startTime?: string,
    endTime?: string,
    query?: string,
    connectionTimeout?: number,
  }): CancelablePromise<TagApiTagValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/integration/web-api/tag/{tagName}/value',
      path: {
        'tagName': tagName,
      },
      query: {
        'startTime': startTime,
        'endTime': endTime,
        'query': query,
        'connectionTimeout': connectionTimeout,
      },
    });
  }
  /**
   * @returns TagApiTagValueDtoListApiResponse OK
   * @throws ApiError
   */
  public getMultipleTagValue({
    body,
  }: {
    body?: TagApiGetMultipleTagValueRequest,
  }): CancelablePromise<TagApiTagValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/integration/web-api/tags/read-value',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public insertMultipleTagValue({
    body,
  }: {
    body?: TagApiInsertMultipleTagValuesRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/integration/web-api/tags/bulk-insert-values',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public testInsertMultipleTagValue({
    body,
  }: {
    body?: TagApiTestInsertMultipleTagValuesRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/integration/web-api/tags/bulk-insert-values/test',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateMultipleTagValue({
    tagName,
    connectionTimeout,
    body,
  }: {
    tagName: string,
    connectionTimeout?: number,
    body?: TagApiUpdateMultipleTagValuesRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/integration/web-api/tag/{tagName}/bulk-update-values',
      path: {
        'tagName': tagName,
      },
      query: {
        'connectionTimeout': connectionTimeout,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteMultipleTagValues({
    tagName,
    connectionTimeout,
    body,
  }: {
    tagName: string,
    connectionTimeout?: number,
    body?: TagApiDeleteMultipleTagValuesRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/integration/web-api/tag/{tagName}/bulk-delete-values',
      path: {
        'tagName': tagName,
      },
      query: {
        'connectionTimeout': connectionTimeout,
      },
      body: body,
    });
  }
  /**
   * @returns ProviderTagRelationApiDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getTagRelationApiByPaging({
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    filters,
    connectionTimeout,
  }: {
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
    filters?: string,
    connectionTimeout?: number,
  }): CancelablePromise<ProviderTagRelationApiDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/integration/web-api/tag-relation',
      query: {
        'page': page,
        'pageSize': pageSize,
        'searchTerm': searchTerm,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
        'filters': filters,
        'connectionTimeout': connectionTimeout,
      },
    });
  }
  /**
   * @returns ProviderTagRelationApiDtoApiResponse OK
   * @throws ApiError
   */
  public getTagRelationApiByTagRelationName({
    tagRelationName,
    connectionTimeout,
  }: {
    tagRelationName: string,
    connectionTimeout?: number,
  }): CancelablePromise<ProviderTagRelationApiDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/integration/web-api/tag-relation/{tagRelationName}',
      path: {
        'tagRelationName': tagRelationName,
      },
      query: {
        'connectionTimeout': connectionTimeout,
      },
    });
  }
  /**
   * @returns TagApiTagRelationValueDtoListApiResponse OK
   * @throws ApiError
   */
  public getSingleTagRelationValue({
    tagRelationName,
    startTime,
    endTime,
    query,
    connectionTimeout,
  }: {
    tagRelationName: string,
    startTime?: string,
    endTime?: string,
    query?: string,
    connectionTimeout?: number,
  }): CancelablePromise<TagApiTagRelationValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/integration/web-api/tag-relation/{tagRelationName}/value',
      path: {
        'tagRelationName': tagRelationName,
      },
      query: {
        'startTime': startTime,
        'endTime': endTime,
        'query': query,
        'connectionTimeout': connectionTimeout,
      },
    });
  }
  /**
   * @returns TagApiTagRelationValueDtoListApiResponse OK
   * @throws ApiError
   */
  public getMultipleTagRelationValue({
    body,
  }: {
    body?: TagApiGetMultipleTagRelationValueRequest,
  }): CancelablePromise<TagApiTagRelationValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/integration/web-api/tag-relations/read-value',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public testInsertTagRelationValue({
    body,
  }: {
    body?: TagApiTestInsertTagRelationValuesRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/integration/web-api/tag-relation/insert-value/test',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public insertMultipleTagRelationValue({
    body,
  }: {
    body?: TagApiInsertMultipleTagRelationValuesRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/integration/web-api/tag-relations/bulk-insert-values',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public testInsertMultipleTagRelationValue({
    body,
  }: {
    body?: TagApiInsertMultipleTagRelationValuesRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/integration/web-api/tag-relations/bulk-insert-values/test',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateMultipleTagRelationValue({
    tagRelationName,
    connectionTimeout,
    body,
  }: {
    tagRelationName: string,
    connectionTimeout?: number,
    body?: TagApiUpdateMultipleTagRelationValuesRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/integration/web-api/tag-relation/{tagRelationName}/bulk-update-values',
      path: {
        'tagRelationName': tagRelationName,
      },
      query: {
        'connectionTimeout': connectionTimeout,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteMultipleTagRelationValues({
    tagRelationName,
    connectionTimeout,
    body,
  }: {
    tagRelationName: string,
    connectionTimeout?: number,
    body?: TagApiDeleteMultipleTagRelationValuesRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/integration/web-api/tag-relation/{tagRelationName}/bulk-delete-values',
      path: {
        'tagRelationName': tagRelationName,
      },
      query: {
        'connectionTimeout': connectionTimeout,
      },
      body: body,
    });
  }
}
