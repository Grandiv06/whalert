/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePlatformUserInput } from '../models/CreatePlatformUserInput';
import type { CreateProviderWithUserInput } from '../models/CreateProviderWithUserInput';
import type { EntityDtoOfInt64 } from '../models/EntityDtoOfInt64';
import type { GetAllProvidersForPanelInput } from '../models/GetAllProvidersForPanelInput';
import type { GetAllUsersForPanelInput } from '../models/GetAllUsersForPanelInput';
import type { ListResultDtoOfSubscriptionPlanAdminListItemDto } from '../models/ListResultDtoOfSubscriptionPlanAdminListItemDto';
import type { PagedResultDtoOfPlatformUserListItemDto } from '../models/PagedResultDtoOfPlatformUserListItemDto';
import type { PagedResultDtoOfProviderAdminListItemDto } from '../models/PagedResultDtoOfProviderAdminListItemDto';
import type { PanelContextOutput } from '../models/PanelContextOutput';
import type { PlatformUserEditOutput } from '../models/PlatformUserEditOutput';
import type { ProviderAdminEditOutput } from '../models/ProviderAdminEditOutput';
import type { ResetProviderPasswordInput } from '../models/ResetProviderPasswordInput';
import type { SetPlatformUserActiveInput } from '../models/SetPlatformUserActiveInput';
import type { SetProviderActiveInput } from '../models/SetProviderActiveInput';
import type { SetSubscriptionPlanActiveInput } from '../models/SetSubscriptionPlanActiveInput';
import type { SetSubscriptionPlanPurchasableInput } from '../models/SetSubscriptionPlanPurchasableInput';
import type { SubscriptionPlanAdminListItemDto } from '../models/SubscriptionPlanAdminListItemDto';
import type { UpdatePlatformUserInput } from '../models/UpdatePlatformUserInput';
import type { UpdateProviderAdminInput } from '../models/UpdateProviderAdminInput';
import type { UpdateSubscriptionPlanDiscountInput } from '../models/UpdateSubscriptionPlanDiscountInput';
import type { UpdateSubscriptionPlanInput } from '../models/UpdateSubscriptionPlanInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminDashboardService {
    /**
     * @returns PanelContextOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardGetpanelcontextPost(): CancelablePromise<PanelContextOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/GetPanelContext',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfProviderAdminListItemDto Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardGetallprovidersforpanelPost(
        requestBody?: GetAllProvidersForPanelInput,
    ): CancelablePromise<PagedResultDtoOfProviderAdminListItemDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/GetAllProvidersForPanel',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderAdminEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardGetproviderforadmineditPost(
        requestBody?: EntityDtoOfInt64,
    ): CancelablePromise<ProviderAdminEditOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/GetProviderForAdminEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderAdminEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardCreateproviderwithuserPost(
        requestBody?: CreateProviderWithUserInput,
    ): CancelablePromise<ProviderAdminEditOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/CreateProviderWithUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderAdminEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardUpdateprovideradminPost(
        requestBody?: UpdateProviderAdminInput,
    ): CancelablePromise<ProviderAdminEditOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/UpdateProviderAdmin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardSetprovideractivePost(
        requestBody?: SetProviderActiveInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/SetProviderActive',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardDeleteprovideradminPost(
        requestBody?: EntityDtoOfInt64,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/DeleteProviderAdmin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardResetproviderpasswordPost(
        requestBody?: ResetProviderPasswordInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/ResetProviderPassword',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfPlatformUserListItemDto Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardGetallusersforpanelPost(
        requestBody?: GetAllUsersForPanelInput,
    ): CancelablePromise<PagedResultDtoOfPlatformUserListItemDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/GetAllUsersForPanel',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PlatformUserEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardGetuserforadmineditPost(
        requestBody?: EntityDtoOfInt64,
    ): CancelablePromise<PlatformUserEditOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/GetUserForAdminEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PlatformUserEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardCreateplatformuserPost(
        requestBody?: CreatePlatformUserInput,
    ): CancelablePromise<PlatformUserEditOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/CreatePlatformUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PlatformUserEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardUpdateplatformuserPost(
        requestBody?: UpdatePlatformUserInput,
    ): CancelablePromise<PlatformUserEditOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/UpdatePlatformUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardSetplatformuseractivePost(
        requestBody?: SetPlatformUserActiveInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/SetPlatformUserActive',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardDeleteplatformuserPost(
        requestBody?: EntityDtoOfInt64,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/DeletePlatformUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardResetplatformuserpasswordPost(
        requestBody?: ResetProviderPasswordInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/ResetPlatformUserPassword',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ListResultDtoOfSubscriptionPlanAdminListItemDto Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardGetallsubscriptionplansforpanelPost(): CancelablePromise<ListResultDtoOfSubscriptionPlanAdminListItemDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/GetAllSubscriptionPlansForPanel',
        });
    }
    /**
     * @param requestBody
     * @returns SubscriptionPlanAdminListItemDto Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardUpdatesubscriptionplandiscountPost(
        requestBody?: UpdateSubscriptionPlanDiscountInput,
    ): CancelablePromise<SubscriptionPlanAdminListItemDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/UpdateSubscriptionPlanDiscount',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns SubscriptionPlanAdminListItemDto Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardUpdatesubscriptionplanPost(
        requestBody?: UpdateSubscriptionPlanInput,
    ): CancelablePromise<SubscriptionPlanAdminListItemDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/UpdateSubscriptionPlan',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardSetsubscriptionplanactivePost(
        requestBody?: SetSubscriptionPlanActiveInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/SetSubscriptionPlanActive',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAdmindashboardSetsubscriptionplanpurchasablePost(
        requestBody?: SetSubscriptionPlanPurchasableInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AdminDashboard/SetSubscriptionPlanPurchasable',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
