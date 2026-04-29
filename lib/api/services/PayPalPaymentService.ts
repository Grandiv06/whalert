/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayPalConfigurationDto } from '../models/PayPalConfigurationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PayPalPaymentService {
    /**
     * @param paymentId
     * @param paypalOrderId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppPaypalpaymentConfirmpaymentPost(
        paymentId?: number,
        paypalOrderId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/PayPalPayment/ConfirmPayment',
            query: {
                'paymentId': paymentId,
                'paypalOrderId': paypalOrderId,
            },
        });
    }
    /**
     * @returns PayPalConfigurationDto Success
     * @throws ApiError
     */
    public static apiServicesAppPaypalpaymentGetconfigurationGet(): CancelablePromise<PayPalConfigurationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/PayPalPayment/GetConfiguration',
        });
    }
}
