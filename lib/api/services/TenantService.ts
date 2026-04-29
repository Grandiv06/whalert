/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTenantInput } from '../models/CreateTenantInput';
import type { EntityDto } from '../models/EntityDto';
import type { GetTenantFeaturesEditOutput } from '../models/GetTenantFeaturesEditOutput';
import type { PagedResultDtoOfTenantListDto } from '../models/PagedResultDtoOfTenantListDto';
import type { TenantEditDto } from '../models/TenantEditDto';
import type { UpdateTenantFeaturesInput } from '../models/UpdateTenantFeaturesInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TenantService {
    /**
     * @param filter
     * @param subscriptionEndDateStart
     * @param subscriptionEndDateEnd
     * @param creationDateStart
     * @param creationDateEnd
     * @param editionId
     * @param editionIdSpecified
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns PagedResultDtoOfTenantListDto Success
     * @throws ApiError
     */
    public static apiServicesAppTenantGettenantsGet(
        filter?: string,
        subscriptionEndDateStart?: string,
        subscriptionEndDateEnd?: string,
        creationDateStart?: string,
        creationDateEnd?: string,
        editionId?: number,
        editionIdSpecified?: boolean,
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<PagedResultDtoOfTenantListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Tenant/GetTenants',
            query: {
                'Filter': filter,
                'SubscriptionEndDateStart': subscriptionEndDateStart,
                'SubscriptionEndDateEnd': subscriptionEndDateEnd,
                'CreationDateStart': creationDateStart,
                'CreationDateEnd': creationDateEnd,
                'EditionId': editionId,
                'EditionIdSpecified': editionIdSpecified,
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantCreatetenantPost(
        requestBody?: CreateTenantInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Tenant/CreateTenant',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns TenantEditDto Success
     * @throws ApiError
     */
    public static apiServicesAppTenantGettenantforeditGet(
        id?: number,
    ): CancelablePromise<TenantEditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Tenant/GetTenantForEdit',
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
    public static apiServicesAppTenantUpdatetenantPut(
        requestBody?: TenantEditDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Tenant/UpdateTenant',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantDeletetenantDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Tenant/DeleteTenant',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetTenantFeaturesEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantGettenantfeaturesforeditGet(
        id?: number,
    ): CancelablePromise<GetTenantFeaturesEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Tenant/GetTenantFeaturesForEdit',
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
    public static apiServicesAppTenantUpdatetenantfeaturesPut(
        requestBody?: UpdateTenantFeaturesInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Tenant/UpdateTenantFeatures',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantResettenantspecificfeaturesPost(
        requestBody?: EntityDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Tenant/ResetTenantSpecificFeatures',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantUnlocktenantadminPost(
        requestBody?: EntityDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Tenant/UnlockTenantAdmin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
