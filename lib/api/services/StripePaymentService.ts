/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StripeConfigurationDto } from '../models/StripeConfigurationDto';
import type { StripeCreatePaymentSessionInput } from '../models/StripeCreatePaymentSessionInput';
import type { StripePaymentResultOutput } from '../models/StripePaymentResultOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StripePaymentService {
    /**
     * @returns StripeConfigurationDto Success
     * @throws ApiError
     */
    public static apiServicesAppStripepaymentGetconfigurationGet(): CancelablePromise<StripeConfigurationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/StripePayment/GetConfiguration',
        });
    }
    /**
     * @param requestBody
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppStripepaymentCreatepaymentsessionPost(
        requestBody?: StripeCreatePaymentSessionInput,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/StripePayment/CreatePaymentSession',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param paymentId
     * @returns StripePaymentResultOutput Success
     * @throws ApiError
     */
    public static apiServicesAppStripepaymentGetpaymentresultGet(
        paymentId?: number,
    ): CancelablePromise<StripePaymentResultOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/StripePayment/GetPaymentResult',
            query: {
                'PaymentId': paymentId,
            },
        });
    }
}
