/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Int32ApiResponse } from '../models/Int32ApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { PublisherCreateRequest } from '../models/PublisherCreateRequest';
import type { PublisherDetailDtoApiResponse } from '../models/PublisherDetailDtoApiResponse';
import type { PublisherDtoPagedResultApiResponse } from '../models/PublisherDtoPagedResultApiResponse';
import type { PublisherUpdateRequest } from '../models/PublisherUpdateRequest';
import type { TagApiDtoPagedResultApiResponse } from '../models/TagApiDtoPagedResultApiResponse';
import type { TagRelationApiDtoPagedResultApiResponse } from '../models/TagRelationApiDtoPagedResultApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class IntegrationService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns TagApiDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getTagApisByPaging({
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    filters,
  }: {
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
    filters?: string,
  }): CancelablePromise<TagApiDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/integration/provider/tag-apis',
      query: {
        'page': page,
        'pageSize': pageSize,
        'searchTerm': searchTerm,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
        'filters': filters,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateTagApiStatusById({
    tagApiId,
    status,
  }: {
    tagApiId: number,
    status: boolean,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/integration/provider/tag-apis/{tagApiId}/{status}',
      path: {
        'tagApiId': tagApiId,
        'status': status,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateAllTagApiStatus({
    status,
  }: {
    status: boolean,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/integration/provider/tag-apis/update-status-all/{status}',
      path: {
        'status': status,
      },
    });
  }
  /**
   * @returns TagRelationApiDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getTagRelationApisByPaging({
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    filters,
  }: {
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
    filters?: string,
  }): CancelablePromise<TagRelationApiDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/integration/provider/tag-relation-apis',
      query: {
        'page': page,
        'pageSize': pageSize,
        'searchTerm': searchTerm,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
        'filters': filters,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateTagRelationApiStatusById({
    tagRelationApiId,
    status,
  }: {
    tagRelationApiId: number,
    status: boolean,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/integration/provider/tag-relation-apis/{tagRelationApiId}/{status}',
      path: {
        'tagRelationApiId': tagRelationApiId,
        'status': status,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateAllTagRelationApiStatus({
    status,
  }: {
    status: boolean,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/integration/provider/tag-relation-apis/update-status-all/{status}',
      path: {
        'status': status,
      },
    });
  }
  /**
   * @returns PublisherDtoPagedResultApiResponse OK
   * @throws ApiError
   */
  public getPublisherByPaging({
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    filters,
  }: {
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
    filters?: string,
  }): CancelablePromise<PublisherDtoPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/integration/publishers',
      query: {
        'page': page,
        'pageSize': pageSize,
        'searchTerm': searchTerm,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
        'filters': filters,
      },
    });
  }
  /**
   * @returns PublisherDetailDtoApiResponse OK
   * @throws ApiError
   */
  public getPublisherById({
    id,
  }: {
    id: number,
  }): CancelablePromise<PublisherDetailDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/integration/publisher/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updatePublisher({
    id,
    body,
  }: {
    id: number,
    body?: PublisherUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/integration/publisher/{id}',
      path: {
        'id': id,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deletePublisher({
    id,
  }: {
    id: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/integration/publisher/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns Int32ApiResponse OK
   * @throws ApiError
   */
  public createPublisher({
    body,
  }: {
    body?: PublisherCreateRequest,
  }): CancelablePromise<Int32ApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/integration/publisher',
      body: body,
    });
  }
}
