/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FactoryDtoApiResponse } from '../models/FactoryDtoApiResponse';
import type { LimitInformationByServiceResultApiResponse } from '../models/LimitInformationByServiceResultApiResponse';
import type { LimitInformationResultApiResponse } from '../models/LimitInformationResultApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ManagementService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns FactoryDtoApiResponse OK
   * @throws ApiError
   */
  public getFactoryById({
    factoryId,
  }: {
    factoryId: number,
  }): CancelablePromise<FactoryDtoApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/management/factory/{factoryId}',
      path: {
        'factoryId': factoryId,
      },
    });
  }
  /**
   * @returns LimitInformationResultApiResponse OK
   * @throws ApiError
   */
  public getLimitInformation(): CancelablePromise<LimitInformationResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/management/limit-information',
    });
  }
  /**
   * @returns LimitInformationByServiceResultApiResponse OK
   * @throws ApiError
   */
  public getLimitInformationByServiceName({
    serviceName,
  }: {
    serviceName: string,
  }): CancelablePromise<LimitInformationByServiceResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/management/limit-information/{serviceName}',
      path: {
        'serviceName': serviceName,
      },
    });
  }
}
