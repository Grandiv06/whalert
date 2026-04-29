/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityDtoOfString } from '../models/EntityDtoOfString';
import type { ListResultDtoOfCacheDto } from '../models/ListResultDtoOfCacheDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CachingService {
    /**
     * @returns ListResultDtoOfCacheDto Success
     * @throws ApiError
     */
    public static apiServicesAppCachingGetallcachesGet(): CancelablePromise<ListResultDtoOfCacheDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Caching/GetAllCaches',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppCachingClearcachePost(
        requestBody?: EntityDtoOfString,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Caching/ClearCache',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppCachingClearallcachesPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Caching/ClearAllCaches',
        });
    }
    /**
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppCachingCanclearallcachesPost(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Caching/CanClearAllCaches',
        });
    }
}
