/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DynamicEntityPropertyDto } from '../models/DynamicEntityPropertyDto';
import type { ListResultDtoOfDynamicEntityPropertyDto } from '../models/ListResultDtoOfDynamicEntityPropertyDto';
import type { ListResultDtoOfGetAllEntitiesHasDynamicPropertyOutput } from '../models/ListResultDtoOfGetAllEntitiesHasDynamicPropertyOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DynamicEntityPropertyService {
    /**
     * @param id
     * @returns DynamicEntityPropertyDto Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyGetGet(
        id?: number,
    ): CancelablePromise<DynamicEntityPropertyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicEntityProperty/Get',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param entityFullName
     * @returns ListResultDtoOfDynamicEntityPropertyDto Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyGetallpropertiesofanentityGet(
        entityFullName?: string,
    ): CancelablePromise<ListResultDtoOfDynamicEntityPropertyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicEntityProperty/GetAllPropertiesOfAnEntity',
            query: {
                'EntityFullName': entityFullName,
            },
        });
    }
    /**
     * @returns ListResultDtoOfDynamicEntityPropertyDto Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyGetallGet(): CancelablePromise<ListResultDtoOfDynamicEntityPropertyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicEntityProperty/GetAll',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyAddPost(
        requestBody?: DynamicEntityPropertyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DynamicEntityProperty/Add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyUpdatePut(
        requestBody?: DynamicEntityPropertyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/DynamicEntityProperty/Update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/DynamicEntityProperty/Delete',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @returns ListResultDtoOfGetAllEntitiesHasDynamicPropertyOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyGetallentitieshasdynamicpropertyGet(): CancelablePromise<ListResultDtoOfGetAllEntitiesHasDynamicPropertyOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicEntityProperty/GetAllEntitiesHasDynamicProperty',
        });
    }
}
