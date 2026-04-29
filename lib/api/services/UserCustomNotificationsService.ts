/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditUserCustomNotificationDto } from '../models/CreateOrEditUserCustomNotificationDto';
import type { FileDto } from '../models/FileDto';
import type { GetUserCustomNotificationForEditOutput } from '../models/GetUserCustomNotificationForEditOutput';
import type { GetUserCustomNotificationForViewDto } from '../models/GetUserCustomNotificationForViewDto';
import type { PagedResultDtoOfGetUserCustomNotificationForViewDto } from '../models/PagedResultDtoOfGetUserCustomNotificationForViewDto';
import type { PagedResultDtoOfUserCustomNotificationCustomNotificationLookupTableDto } from '../models/PagedResultDtoOfUserCustomNotificationCustomNotificationLookupTableDto';
import type { PagedResultDtoOfUserCustomNotificationUserLookupTableDto } from '../models/PagedResultDtoOfUserCustomNotificationUserLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserCustomNotificationsService {
    /**
     * @param filter
     * @param notificationStatusFilter
     * @param customNotificationTitleFilter
     * @param userNameFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetUserCustomNotificationForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsercustomnotificationsGetallGet(
        filter?: string,
        notificationStatusFilter?: number,
        customNotificationTitleFilter?: string,
        userNameFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetUserCustomNotificationForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserCustomNotifications/GetAll',
            query: {
                'Filter': filter,
                'NotificationStatusFilter': notificationStatusFilter,
                'CustomNotificationTitleFilter': customNotificationTitleFilter,
                'UserNameFilter': userNameFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetUserCustomNotificationForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsercustomnotificationsGetusercustomnotificationforviewGet(
        id?: number,
    ): CancelablePromise<GetUserCustomNotificationForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserCustomNotifications/GetUserCustomNotificationForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetUserCustomNotificationForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUsercustomnotificationsGetusercustomnotificationforeditGet(
        id?: number,
    ): CancelablePromise<GetUserCustomNotificationForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserCustomNotifications/GetUserCustomNotificationForEdit',
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
    public static apiServicesAppUsercustomnotificationsCreateoreditPost(
        requestBody?: CreateOrEditUserCustomNotificationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserCustomNotifications/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUsercustomnotificationsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/UserCustomNotifications/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param notificationStatusFilter
     * @param customNotificationTitleFilter
     * @param userNameFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsercustomnotificationsGetusercustomnotificationstoexcelGet(
        filter?: string,
        notificationStatusFilter?: number,
        customNotificationTitleFilter?: string,
        userNameFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserCustomNotifications/GetUserCustomNotificationsToExcel',
            query: {
                'Filter': filter,
                'NotificationStatusFilter': notificationStatusFilter,
                'CustomNotificationTitleFilter': customNotificationTitleFilter,
                'UserNameFilter': userNameFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfUserCustomNotificationCustomNotificationLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsercustomnotificationsGetallcustomnotificationforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfUserCustomNotificationCustomNotificationLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserCustomNotifications/GetAllCustomNotificationForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfUserCustomNotificationUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsercustomnotificationsGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfUserCustomNotificationUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserCustomNotifications/GetAllUserForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
