/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetSubscriptionPaymentHistoryOutput } from '../models/GetSubscriptionPaymentHistoryOutput';
import type { RequestSubscriptionPaymentInput } from '../models/RequestSubscriptionPaymentInput';
import type { RequestSubscriptionPaymentOutput } from '../models/RequestSubscriptionPaymentOutput';
import type { VerifySubscriptionPaymentOutput } from '../models/VerifySubscriptionPaymentOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscriptionPurchaseService {
    /**
     * @returns GetSubscriptionPaymentHistoryOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptionpurchaseGetcurrentuserpaymenthistoryGet(): CancelablePromise<GetSubscriptionPaymentHistoryOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SubscriptionPurchase/GetCurrentUserPaymentHistory',
        });
    }
    /**
     * @param authority
     * @param status
     * @param paymentId
     * @returns VerifySubscriptionPaymentOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptionpurchaseVerifypaymentGet(
        authority?: string,
        status?: string,
        paymentId?: number,
    ): CancelablePromise<VerifySubscriptionPaymentOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SubscriptionPurchase/VerifyPayment',
            query: {
                'authority': authority,
                'status': status,
                'paymentId': paymentId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns RequestSubscriptionPaymentOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSubscriptionpurchaseRequestpaymentPost(
        requestBody?: RequestSubscriptionPaymentInput,
    ): CancelablePromise<RequestSubscriptionPaymentOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SubscriptionPurchase/RequestPayment',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
