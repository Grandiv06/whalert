/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DynamicPropertyValueDto } from '../models/DynamicPropertyValueDto';
import type { ListResultDtoOfDynamicPropertyValueDto } from '../models/ListResultDtoOfDynamicPropertyValueDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DynamicPropertyValueService {
    /**
     * @param id
     * @returns DynamicPropertyValueDto Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyvalueGetGet(
        id?: number,
    ): CancelablePromise<DynamicPropertyValueDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicPropertyValue/Get',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns ListResultDtoOfDynamicPropertyValueDto Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyvalueGetallvaluesofdynamicpropertyGet(
        id?: number,
    ): CancelablePromise<ListResultDtoOfDynamicPropertyValueDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicPropertyValue/GetAllValuesOfDynamicProperty',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyvalueAddPost(
        requestBody?: DynamicPropertyValueDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DynamicPropertyValue/Add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyvalueUpdatePut(
        requestBody?: DynamicPropertyValueDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/DynamicPropertyValue/Update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyvalueDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/DynamicPropertyValue/Delete',
            query: {
                'id': id,
            },
        });
    }
}
