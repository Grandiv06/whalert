/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CleanValuesInput } from '../models/CleanValuesInput';
import type { DynamicEntityPropertyValueDto } from '../models/DynamicEntityPropertyValueDto';
import type { GetAllDynamicEntityPropertyValuesOutput } from '../models/GetAllDynamicEntityPropertyValuesOutput';
import type { InsertOrUpdateAllValuesInput } from '../models/InsertOrUpdateAllValuesInput';
import type { ListResultDtoOfDynamicEntityPropertyValueDto } from '../models/ListResultDtoOfDynamicEntityPropertyValueDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DynamicEntityPropertyValueService {
    /**
     * @param id
     * @returns DynamicEntityPropertyValueDto Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyvalueGetGet(
        id?: number,
    ): CancelablePromise<DynamicEntityPropertyValueDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicEntityPropertyValue/Get',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param entityId
     * @param propertyId
     * @returns ListResultDtoOfDynamicEntityPropertyValueDto Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyvalueGetallGet(
        entityId?: string,
        propertyId?: number,
    ): CancelablePromise<ListResultDtoOfDynamicEntityPropertyValueDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicEntityPropertyValue/GetAll',
            query: {
                'EntityId': entityId,
                'PropertyId': propertyId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyvalueAddPost(
        requestBody?: DynamicEntityPropertyValueDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DynamicEntityPropertyValue/Add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyvalueUpdatePut(
        requestBody?: DynamicEntityPropertyValueDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/DynamicEntityPropertyValue/Update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyvalueDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/DynamicEntityPropertyValue/Delete',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param entityFullName
     * @param entityId
     * @returns GetAllDynamicEntityPropertyValuesOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyvalueGetalldynamicentitypropertyvaluesGet(
        entityFullName: string,
        entityId: string,
    ): CancelablePromise<GetAllDynamicEntityPropertyValuesOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicEntityPropertyValue/GetAllDynamicEntityPropertyValues',
            query: {
                'EntityFullName': entityFullName,
                'EntityId': entityId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyvalueInsertorupdateallvaluesPost(
        requestBody?: InsertOrUpdateAllValuesInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DynamicEntityPropertyValue/InsertOrUpdateAllValues',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertyvalueCleanvaluesPost(
        requestBody?: CleanValuesInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DynamicEntityPropertyValue/CleanValues',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
