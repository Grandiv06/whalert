/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StartExtendSubscriptionInput } from '../models/StartExtendSubscriptionInput';
import type { StartTrialToBuySubscriptionInput } from '../models/StartTrialToBuySubscriptionInput';
import type { StartUpgradeSubscriptionInput } from '../models/StartUpgradeSubscriptionInput';
import type { StartUpgradeSubscriptionOutput } from '../models/StartUpgradeSubscriptionOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscriptionService {
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptionDisablerecurringpaymentsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Subscription/DisableRecurringPayments',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptionEnablerecurringpaymentsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Subscription/EnableRecurringPayments',
        });
    }
    /**
     * @param requestBody
     * @returns number Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptionStartextendsubscriptionPost(
        requestBody?: StartExtendSubscriptionInput,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Subscription/StartExtendSubscription',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns StartUpgradeSubscriptionOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptionStartupgradesubscriptionPost(
        requestBody?: StartUpgradeSubscriptionInput,
    ): CancelablePromise<StartUpgradeSubscriptionOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Subscription/StartUpgradeSubscription',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns number Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptionStarttrialtobuysubscriptionPost(
        requestBody?: StartTrialToBuySubscriptionInput,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Subscription/StartTrialToBuySubscription',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
