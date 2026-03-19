/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { InterfaceRestApiCheckTimeStampFieldRequest } from '../models/InterfaceRestApiCheckTimeStampFieldRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RestApiService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public checkTimestampField({
    body,
  }: {
    body?: InterfaceRestApiCheckTimeStampFieldRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/interface/rest-api/validate',
      body: body,
    });
  }
}
