/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EditionSelectDto } from '../models/EditionSelectDto';
import type { EditionsSelectOutput } from '../models/EditionsSelectOutput';
import type { RegisterTenantInput } from '../models/RegisterTenantInput';
import type { RegisterTenantOutput } from '../models/RegisterTenantOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TenantRegistrationService {
    /**
     * @param requestBody
     * @returns RegisterTenantOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantregistrationRegistertenantPost(
        requestBody?: RegisterTenantInput,
    ): CancelablePromise<RegisterTenantOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantRegistration/RegisterTenant',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param paymentId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantregistrationBuynowsucceedPost(
        paymentId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantRegistration/BuyNowSucceed',
            query: {
                'paymentId': paymentId,
            },
        });
    }
    /**
     * @param paymentId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantregistrationNewregistrationsucceedPost(
        paymentId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantRegistration/NewRegistrationSucceed',
            query: {
                'paymentId': paymentId,
            },
        });
    }
    /**
     * @param paymentId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantregistrationUpgradesucceedPost(
        paymentId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantRegistration/UpgradeSucceed',
            query: {
                'paymentId': paymentId,
            },
        });
    }
    /**
     * @param paymentId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantregistrationExtendsucceedPost(
        paymentId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantRegistration/ExtendSucceed',
            query: {
                'paymentId': paymentId,
            },
        });
    }
    /**
     * @returns EditionsSelectOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantregistrationGeteditionsforselectGet(): CancelablePromise<EditionsSelectOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantRegistration/GetEditionsForSelect',
        });
    }
    /**
     * @param editionId
     * @returns EditionSelectDto Success
     * @throws ApiError
     */
    public static apiServicesAppTenantregistrationGeteditionGet(
        editionId?: number,
    ): CancelablePromise<EditionSelectDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantRegistration/GetEdition',
            query: {
                'editionId': editionId,
            },
        });
    }
}
