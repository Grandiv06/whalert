/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProviderWithUserInput } from '../models/CreateProviderWithUserInput';
import type { EntityDtoOfInt64 } from '../models/EntityDtoOfInt64';
import type { GetAllProvidersForPanelInput } from '../models/GetAllProvidersForPanelInput';
import type { PagedResultDtoOfProviderAdminListItemDto } from '../models/PagedResultDtoOfProviderAdminListItemDto';
import type { PanelContextOutput } from '../models/PanelContextOutput';
import type { ProviderAdminEditOutput } from '../models/ProviderAdminEditOutput';
import type { ResetProviderPasswordInput } from '../models/ResetProviderPasswordInput';
import type { SetProviderActiveInput } from '../models/SetProviderActiveInput';
import type { UpdateProviderAdminInput } from '../models/UpdateProviderAdminInput';
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
}
