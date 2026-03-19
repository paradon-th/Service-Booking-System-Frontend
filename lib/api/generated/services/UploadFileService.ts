/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileDtoApiResponse } from '../models/FileDtoApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UploadFileService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns FileDtoApiResponse OK
   * @throws ApiError
   */
  public uploadFile({
    file,
    oldFilePath,
  }: {
    file?: Blob,
    oldFilePath?: string,
  }): CancelablePromise<FileDtoApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/upload-file',
      formData: {
        'file': file,
        'oldFilePath': oldFilePath,
      },
    });
  }
}
