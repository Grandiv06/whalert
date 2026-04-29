/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPlanCatalogItemDto } from '../models/SubscriptionPlanCatalogItemDto';
import type { SubscriptionPlanDetailDto } from '../models/SubscriptionPlanDetailDto';
import type { SubscriptionPurchaseStatusDto } from '../models/SubscriptionPurchaseStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscriptionDashboardService {
    /**
     * @returns SubscriptionPlanCatalogItemDto Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptiondashboardGetactivesubscriptionplansGet(): CancelablePromise<Array<SubscriptionPlanCatalogItemDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SubscriptionDashboard/GetActiveSubscriptionPlans',
        });
    }
    /**
     * @param planId
     * @returns SubscriptionPlanDetailDto Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptiondashboardGetsubscriptionplandetailGet(
        planId?: number,
    ): CancelablePromise<SubscriptionPlanDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SubscriptionDashboard/GetSubscriptionPlanDetail',
            query: {
                'planId': planId,
            },
        });
    }
    /**
     * @param paymentId
     * @returns SubscriptionPurchaseStatusDto Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptiondashboardGetsubscriptionpurchasestatusGet(
        paymentId?: number,
    ): CancelablePromise<SubscriptionPurchaseStatusDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SubscriptionDashboard/GetSubscriptionPurchaseStatus',
            query: {
                'paymentId': paymentId,
            },
        });
    }
}
