/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ZarinpalCreatePaymentInput } from '../models/ZarinpalCreatePaymentInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ZarinpalPaymentService {
    /**
     * @param requestBody
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppZarinpalpaymentCreatepaymenturlPost(
        requestBody?: ZarinpalCreatePaymentInput,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/ZarinpalPayment/CreatePaymentUrl',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param paymentId
     * @param authority
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppZarinpalpaymentConfirmpaymentPost(
        paymentId?: number,
        authority?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/ZarinpalPayment/ConfirmPayment',
            query: {
                'paymentId': paymentId,
                'authority': authority,
            },
        });
    }
}
