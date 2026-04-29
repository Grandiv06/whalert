/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DynamicEntityPropertyDefinitionService {
    /**
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertydefinitionGetallallowedinputtypenamesGet(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicEntityPropertyDefinition/GetAllAllowedInputTypeNames',
        });
    }
    /**
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppDynamicentitypropertydefinitionGetallentitiesGet(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DynamicEntityPropertyDefinition/GetAllEntities',
        });
    }
}
