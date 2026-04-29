/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DynamicPropertyDto } from '../models/DynamicPropertyDto';
import type { IInputType } from '../models/IInputType';
import type { ListResultDtoOfDynamicPropertyDto } from '../models/ListResultDtoOfDynamicPropertyDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DynamicPropertyService {
    /**
     * @param id
     * @returns DynamicPropertyDto Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyGetGet(
        id?: number,
    ): CancelablePromise<DynamicPropertyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicProperty/Get',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @returns ListResultDtoOfDynamicPropertyDto Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyGetallGet(): CancelablePromise<ListResultDtoOfDynamicPropertyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicProperty/GetAll',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyAddPost(
        requestBody?: DynamicPropertyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DynamicProperty/Add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyUpdatePut(
        requestBody?: DynamicPropertyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/DynamicProperty/Update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/DynamicProperty/Delete',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param name
     * @returns IInputType Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicpropertyFindallowedinputtypePost(
        name?: string,
    ): CancelablePromise<IInputType> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DynamicProperty/FindAllowedInputType',
            query: {
                'name': name,
            },
        });
    }
}
