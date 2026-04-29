/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditCustomNotificationDto } from '../models/CreateOrEditCustomNotificationDto';
import type { FileDto } from '../models/FileDto';
import type { GetCustomNotificationForEditOutput } from '../models/GetCustomNotificationForEditOutput';
import type { GetCustomNotificationForViewDto } from '../models/GetCustomNotificationForViewDto';
import type { PagedResultDtoOfGetCustomNotificationForViewDto } from '../models/PagedResultDtoOfGetCustomNotificationForViewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CustomNotificationsService {
    /**
     * @param filter
     * @param titleFilter
     * @param contentFilter
     * @param broadCastFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetCustomNotificationForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppCustomnotificationsGetallGet(
        filter?: string,
        titleFilter?: string,
        contentFilter?: string,
        broadCastFilter?: number,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetCustomNotificationForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/CustomNotifications/GetAll',
            query: {
                'Filter': filter,
                'TitleFilter': titleFilter,
                'ContentFilter': contentFilter,
                'BroadCastFilter': broadCastFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetCustomNotificationForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppCustomnotificationsGetcustomnotificationforviewGet(
        id?: number,
    ): CancelablePromise<GetCustomNotificationForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/CustomNotifications/GetCustomNotificationForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetCustomNotificationForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppCustomnotificationsGetcustomnotificationforeditGet(
        id?: number,
    ): CancelablePromise<GetCustomNotificationForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/CustomNotifications/GetCustomNotificationForEdit',
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
    public static apiServicesAppCustomnotificationsCreateoreditPost(
        requestBody?: CreateOrEditCustomNotificationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/CustomNotifications/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppCustomnotificationsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/CustomNotifications/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param titleFilter
     * @param contentFilter
     * @param broadCastFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppCustomnotificationsGetcustomnotificationstoexcelGet(
        filter?: string,
        titleFilter?: string,
        contentFilter?: string,
        broadCastFilter?: number,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/CustomNotifications/GetCustomNotificationsToExcel',
            query: {
                'Filter': filter,
                'TitleFilter': titleFilter,
                'ContentFilter': contentFilter,
                'BroadCastFilter': broadCastFilter,
            },
        });
    }
}
