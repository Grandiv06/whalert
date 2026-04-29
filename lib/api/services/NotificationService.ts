/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMassNotificationInput } from '../models/CreateMassNotificationInput';
import type { EntityDtoOfGuid } from '../models/EntityDtoOfGuid';
import type { GetNotificationSettingsOutput } from '../models/GetNotificationSettingsOutput';
import type { GetNotificationsOutput } from '../models/GetNotificationsOutput';
import type { GetPublishedNotificationsOutput } from '../models/GetPublishedNotificationsOutput';
import type { PagedResultDtoOfMassNotificationOrganizationUnitLookupTableDto } from '../models/PagedResultDtoOfMassNotificationOrganizationUnitLookupTableDto';
import type { PagedResultDtoOfMassNotificationUserLookupTableDto } from '../models/PagedResultDtoOfMassNotificationUserLookupTableDto';
import type { SetNotificationAsReadOutput } from '../models/SetNotificationAsReadOutput';
import type { UpdateNotificationSettingsInput } from '../models/UpdateNotificationSettingsInput';
import type { UserNotificationState } from '../models/UserNotificationState';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationService {
    /**
     * @param state
     * @param startDate
     * @param endDate
     * @param maxResultCount
     * @param skipCount
     * @returns GetNotificationsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationGetusernotificationsGet(
        state?: UserNotificationState,
        startDate?: string,
        endDate?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<GetNotificationsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Notification/GetUserNotifications',
            query: {
                'State': state,
                'StartDate': startDate,
                'EndDate': endDate,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationShoulduserupdateappPost(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Notification/ShouldUserUpdateApp',
        });
    }
    /**
     * @returns SetNotificationAsReadOutput Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationSetallavailableversionnotificationasreadPost(): CancelablePromise<SetNotificationAsReadOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Notification/SetAllAvailableVersionNotificationAsRead',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationSetallnotificationsasreadPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Notification/SetAllNotificationsAsRead',
        });
    }
    /**
     * @param requestBody
     * @returns SetNotificationAsReadOutput Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationSetnotificationasreadPost(
        requestBody?: EntityDtoOfGuid,
    ): CancelablePromise<SetNotificationAsReadOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Notification/SetNotificationAsRead',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns GetNotificationSettingsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationGetnotificationsettingsGet(): CancelablePromise<GetNotificationSettingsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Notification/GetNotificationSettings',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationUpdatenotificationsettingsPut(
        requestBody?: UpdateNotificationSettingsInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Notification/UpdateNotificationSettings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationDeletenotificationDelete(
        id?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Notification/DeleteNotification',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param state
     * @param startDate
     * @param endDate
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationDeleteallusernotificationsDelete(
        state?: UserNotificationState,
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Notification/DeleteAllUserNotifications',
            query: {
                'State': state,
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfMassNotificationUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfMassNotificationUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Notification/GetAllUserForLookupTable',
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
     * @returns PagedResultDtoOfMassNotificationOrganizationUnitLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationGetallorganizationunitforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfMassNotificationOrganizationUnitLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Notification/GetAllOrganizationUnitForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationCreatemassnotificationPost(
        requestBody?: CreateMassNotificationInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Notification/CreateMassNotification',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationCreatenewversionreleasednotificationPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Notification/CreateNewVersionReleasedNotification',
        });
    }
    /**
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationGetallnotifiersGet(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Notification/GetAllNotifiers',
        });
    }
    /**
     * @param startDate
     * @param endDate
     * @returns GetPublishedNotificationsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppNotificationGetnotificationspublishedbyuserGet(
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<GetPublishedNotificationsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Notification/GetNotificationsPublishedByUser',
            query: {
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }
}
