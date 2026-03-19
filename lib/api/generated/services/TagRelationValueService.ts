/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { ExcelColumnListApiResponse } from '../models/ExcelColumnListApiResponse';
import type { ObjectApiResponse } from '../models/ObjectApiResponse';
import type { ObjectListApiResponse } from '../models/ObjectListApiResponse';
import type { ObjectPagedResultApiResponse } from '../models/ObjectPagedResultApiResponse';
import type { StringListApiResponse } from '../models/StringListApiResponse';
import type { TagRelationValueCreateRequest } from '../models/TagRelationValueCreateRequest';
import type { TagRelationValueDeleteByTimeRangeRequest } from '../models/TagRelationValueDeleteByTimeRangeRequest';
import type { TagRelationValueDeleteRequest } from '../models/TagRelationValueDeleteRequest';
import type { TagRelationValueDtoIEnumerableApiResponse } from '../models/TagRelationValueDtoIEnumerableApiResponse';
import type { TagRelationValueDtoListApiResponse } from '../models/TagRelationValueDtoListApiResponse';
import type { TagRelationValuePatchRequest } from '../models/TagRelationValuePatchRequest';
import type { TagRelationValueQueryScript } from '../models/TagRelationValueQueryScript';
import type { TagRelationValueTestCreateRequest } from '../models/TagRelationValueTestCreateRequest';
import type { TagRelationValueUpdateRequest } from '../models/TagRelationValueUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TagRelationValueService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns TagRelationValueDtoIEnumerableApiResponse OK
   * @throws ApiError
   */
  public getTagRelationValues({
    id,
    startTime,
    endTime,
    time,
    limit,
    sort,
    query,
    xServiceMainId,
  }: {
    id: number,
    startTime?: string,
    endTime?: string,
    time?: string,
    limit?: string,
    sort?: string,
    query?: string,
    xServiceMainId?: number,
  }): CancelablePromise<TagRelationValueDtoIEnumerableApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/{id}',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'startTime': startTime,
        'endTime': endTime,
        'time': time,
        'limit': limit,
        'sort': sort,
        'query': query,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteSingleTagRelationValue({
    id,
    body,
  }: {
    id: number,
    body?: TagRelationValueDeleteRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value/{id}',
      path: {
        'id': id,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectListApiResponse OK
   * @throws ApiError
   */
  public getTagRelationValuesObject({
    id,
    starttime,
    endtime,
    limit,
    sort,
    query,
    xServiceMainId,
  }: {
    id: number,
    starttime?: string,
    endtime?: string,
    limit?: string,
    sort?: string,
    query?: string,
    xServiceMainId?: number,
  }): CancelablePromise<ObjectListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/{id}/objects',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'starttime': starttime,
        'endtime': endtime,
        'limit': limit,
        'sort': sort,
        'query': query,
      },
    });
  }
  /**
   * @returns ObjectPagedResultApiResponse OK
   * @throws ApiError
   */
  public getTagRelationValuesObjectByPaginate({
    id,
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    filters,
    startTime,
    endTime,
    xServiceMainId,
  }: {
    id: number,
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
    filters?: string,
    startTime?: string,
    endTime?: string,
    xServiceMainId?: number,
  }): CancelablePromise<ObjectPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/{id}/object-paginate',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'page': page,
        'pageSize': pageSize,
        'searchTerm': searchTerm,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
        'filters': filters,
        'startTime': startTime,
        'endTime': endTime,
      },
    });
  }
  /**
   * @deprecated
   * @returns ObjectListApiResponse OK
   * @throws ApiError
   */
  public getTagRelationValuesGroupBy({
    id,
    starttime,
    endtime,
    time,
    limit,
    sort,
    fields,
    sums,
    avgs,
    mins,
    maxs,
    lasts,
    shift,
    xServiceMainId,
  }: {
    id: number,
    starttime?: string,
    endtime?: string,
    time?: string,
    limit?: string,
    sort?: string,
    fields?: Array<string>,
    sums?: Array<string>,
    avgs?: Array<string>,
    mins?: Array<string>,
    maxs?: Array<string>,
    lasts?: Array<string>,
    shift?: string,
    xServiceMainId?: number,
  }): CancelablePromise<ObjectListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/{id}/groupby',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'starttime': starttime,
        'endtime': endtime,
        'time': time,
        'limit': limit,
        'sort': sort,
        'fields': fields,
        'sums': sums,
        'avgs': avgs,
        'mins': mins,
        'maxs': maxs,
        'lasts': lasts,
        'shift': shift,
      },
    });
  }
  /**
   * @returns TagRelationValueDtoListApiResponse OK
   * @throws ApiError
   */
  public getTagRelationValuesFilter({
    id,
    starttime,
    endtime,
    tagIdFilters,
    xServiceMainId,
  }: {
    id: number,
    starttime?: string,
    endtime?: string,
    tagIdFilters?: Array<number>,
    xServiceMainId?: number,
  }): CancelablePromise<TagRelationValueDtoListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/{id}/query',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'starttime': starttime,
        'endtime': endtime,
        'tagIdFilters': tagIdFilters,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public getCreateTagRelationValuesTable({
    id,
    xServiceMainId,
  }: {
    id: number,
    xServiceMainId?: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/createtable/{id}',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public createTagRelationValue({
    xServiceMainId,
    body,
  }: {
    xServiceMainId?: number,
    body?: TagRelationValueCreateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateTagRelationValue({
    body,
  }: {
    body?: TagRelationValueUpdateRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/tag-relation-value',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public createMultipleTagRelationValueByFileUpload({
    paramsTagRelationId,
    paramsTimeStampColumnType,
    paramsTimeStampColFormat,
    paramsTimeStampTimeCol,
    paramsTimeStampTimeColIndex,
    paramsValueStatus,
    paramsSheetName,
    paramsHasHeader,
    paramsHeaderRow,
    paramsDataStartRow,
    paramsValueCols,
    paramsTimeStampCol,
    paramsTimeStampColIndex,
    mapping,
    file,
  }: {
    paramsTagRelationId?: number,
    paramsTimeStampColumnType?: string,
    paramsTimeStampColFormat?: string,
    paramsTimeStampTimeCol?: string,
    paramsTimeStampTimeColIndex?: string,
    paramsValueStatus?: number,
    paramsSheetName?: string,
    paramsHasHeader?: boolean,
    paramsHeaderRow?: number,
    paramsDataStartRow?: number,
    paramsValueCols?: Array<any>,
    paramsTimeStampCol?: string,
    paramsTimeStampColIndex?: number,
    mapping?: string,
    file?: Blob,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value/file',
      formData: {
        'params.tagRelationId': paramsTagRelationId,
        'params.timeStampColumnType': paramsTimeStampColumnType,
        'params.timeStampColFormat': paramsTimeStampColFormat,
        'params.timeStampTimeCol': paramsTimeStampTimeCol,
        'params.timeStampTimeColIndex': paramsTimeStampTimeColIndex,
        'params.valueStatus': paramsValueStatus,
        'params.sheetName': paramsSheetName,
        'params.hasHeader': paramsHasHeader,
        'params.headerRow': paramsHeaderRow,
        'params.dataStartRow': paramsDataStartRow,
        'params.valueCols': paramsValueCols,
        'params.timeStampCol': paramsTimeStampCol,
        'params.timeStampColIndex': paramsTimeStampColIndex,
        'mapping': mapping,
        'file': file,
      },
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public createTagRelationValueTest({
    xServiceMainId,
    body,
  }: {
    xServiceMainId?: number,
    body?: TagRelationValueTestCreateRequest,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value/test',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public updateMultipleTagRelationValues({
    body,
  }: {
    body?: Array<TagRelationValueUpdateRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/tag-relation-value/multipleTagRelationValue',
      body: body,
    });
  }
  /**
   * @returns TagRelationValueDtoIEnumerableApiResponse OK
   * @throws ApiError
   */
  public getMultipleTagRelationValues({
    tagRelationIds,
    starttime,
    endtime,
    time,
    limit,
    sort,
    query,
    xServiceMainId,
  }: {
    tagRelationIds?: Array<number>,
    starttime?: string,
    endtime?: string,
    time?: string,
    limit?: string,
    sort?: string,
    query?: string,
    xServiceMainId?: number,
  }): CancelablePromise<TagRelationValueDtoIEnumerableApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/multipleTagRelationValue',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'tagRelationIds': tagRelationIds,
        'starttime': starttime,
        'endtime': endtime,
        'time': time,
        'limit': limit,
        'sort': sort,
        'query': query,
      },
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public patchMultipleTagRelationValues({
    body,
  }: {
    body?: Array<TagRelationValuePatchRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/api/tag-relation-value/multipleTagRelationValue',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteMultipleTagRelationValue({
    body,
  }: {
    body?: Array<TagRelationValueDeleteRequest>,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value/multipleTagRelationValues',
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public deleteMultipleTagRelationValueByTimeRange({
    body,
  }: {
    body?: TagRelationValueDeleteByTimeRangeRequest,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value/timerange',
      body: body,
    });
  }
  /**
   * @returns ObjectPagedResultApiResponse OK
   * @throws ApiError
   */
  public getTagRelationViewValueByPaginate({
    id,
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    filters,
    xServiceMainId,
  }: {
    id: number,
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
    filters?: string,
    xServiceMainId?: number,
  }): CancelablePromise<ObjectPagedResultApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/queryscript-paginate/{id}',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
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
   * @returns ObjectListApiResponse OK
   * @throws ApiError
   */
  public getTagRelationViewValue({
    id,
    timeCols,
    starttime,
    endtime,
    limit,
    sort,
    xServiceMainId,
  }: {
    id: number,
    timeCols?: Array<string>,
    starttime?: string,
    endtime?: string,
    limit?: string,
    sort?: string,
    xServiceMainId?: number,
  }): CancelablePromise<ObjectListApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/queryscript/{id}',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      query: {
        'timeCols': timeCols,
        'starttime': starttime,
        'endtime': endtime,
        'limit': limit,
        'sort': sort,
      },
    });
  }
  /**
   * @returns ObjectListApiResponse OK
   * @throws ApiError
   */
  public getTagRelationValueScript({
    xServiceMainId,
    body,
  }: {
    xServiceMainId?: number,
    body?: TagRelationValueQueryScript,
  }): CancelablePromise<ObjectListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value/queryscript',
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
      body: body,
    });
  }
  /**
   * @returns ObjectApiResponse OK
   * @throws ApiError
   */
  public getTagRelationViewColumns({
    id,
    xServiceMainId,
  }: {
    id: number,
    xServiceMainId?: number,
  }): CancelablePromise<ObjectApiResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/tag-relation-value/view/columns/{id}',
      path: {
        'id': id,
      },
      headers: {
        'x-ServiceMain-Id': xServiceMainId,
      },
    });
  }
  /**
   * @returns StringListApiResponse OK
   * @throws ApiError
   */
  public getExcelSheetAll({
    file,
  }: {
    file?: Blob,
  }): CancelablePromise<StringListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value/file-template/excel-sheet-all',
      formData: {
        'file': file,
      },
    });
  }
  /**
   * @returns ExcelColumnListApiResponse OK
   * @throws ApiError
   */
  public getColumnAll({
    file,
    sheetName,
    hasHeader,
    headerRow,
    dataStartRow,
    valueCols,
    timeStampCol,
    timeStampColIndex,
  }: {
    file?: Blob,
    sheetName?: string,
    hasHeader?: boolean,
    headerRow?: number,
    dataStartRow?: number,
    valueCols?: Array<any>,
    timeStampCol?: string,
    timeStampColIndex?: number,
  }): CancelablePromise<ExcelColumnListApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value/file-template/excel-column-all',
      formData: {
        'file': file,
        'sheetName': sheetName,
        'hasHeader': hasHeader,
        'headerRow': headerRow,
        'dataStartRow': dataStartRow,
        'valueCols': valueCols,
        'timeStampCol': timeStampCol,
        'timeStampColIndex': timeStampColIndex,
      },
    });
  }
  /**
   * @returns BooleanApiResponse OK
   * @throws ApiError
   */
  public checkTimeStampCol({
    file,
    dateTimeFormat,
    dateCol,
    timeCol,
    dateTimeColFormat,
    sheetName,
    hasHeader,
    headerRow,
    dataStartRow,
    valueCols,
    timeStampCol,
    timeStampColIndex,
  }: {
    file?: Blob,
    dateTimeFormat?: string,
    dateCol?: string,
    timeCol?: string,
    dateTimeColFormat?: string,
    sheetName?: string,
    hasHeader?: boolean,
    headerRow?: number,
    dataStartRow?: number,
    valueCols?: Array<any>,
    timeStampCol?: string,
    timeStampColIndex?: number,
  }): CancelablePromise<BooleanApiResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/tag-relation-value/file-template/validate-timestamp-col',
      formData: {
        'file': file,
        'dateTimeFormat': dateTimeFormat,
        'dateCol': dateCol,
        'timeCol': timeCol,
        'dateTimeColFormat': dateTimeColFormat,
        'sheetName': sheetName,
        'hasHeader': hasHeader,
        'headerRow': headerRow,
        'dataStartRow': dataStartRow,
        'valueCols': valueCols,
        'timeStampCol': timeStampCol,
        'timeStampColIndex': timeStampColIndex,
      },
    });
  }
}
