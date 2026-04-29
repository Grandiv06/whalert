/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelPaymentDto } from '../models/CancelPaymentDto';
import type { CreatePaymentDto } from '../models/CreatePaymentDto';
import type { PagedResultDtoOfSubscriptionPaymentListDto } from '../models/PagedResultDtoOfSubscriptionPaymentListDto';
import type { PaymentGatewayModel } from '../models/PaymentGatewayModel';
import type { SubscriptionPaymentDto } from '../models/SubscriptionPaymentDto';
import type { UpdatePaymentDto } from '../models/UpdatePaymentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentService {
    /**
     * @param requestBody
     * @returns number Success
     * @throws ApiError
     */
    public static apiServicesAppPaymentCreatepaymentPost(
        requestBody?: CreatePaymentDto,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Payment/CreatePayment',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppPaymentCancelpaymentPost(
        requestBody?: CancelPaymentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Payment/CancelPayment',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppPaymentUpdatepaymentPut(
        requestBody?: UpdatePaymentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Payment/UpdatePayment',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns PagedResultDtoOfSubscriptionPaymentListDto Success
     * @throws ApiError
     */
    public static apiServicesAppPaymentGetpaymenthistoryGet(
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<PagedResultDtoOfSubscriptionPaymentListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Payment/GetPaymentHistory',
            query: {
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @param recurringPaymentsEnabled
     * @returns PaymentGatewayModel Success
     * @throws ApiError
     */
    public static apiServicesAppPaymentGetactivegatewaysGet(
        recurringPaymentsEnabled?: boolean,
    ): CancelablePromise<Array<PaymentGatewayModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Payment/GetActiveGateways',
            query: {
                'RecurringPaymentsEnabled': recurringPaymentsEnabled,
            },
        });
    }
    /**
     * @param paymentId
     * @returns SubscriptionPaymentDto Success
     * @throws ApiError
     */
    public static apiServicesAppPaymentGetpaymentGet(
        paymentId?: number,
    ): CancelablePromise<SubscriptionPaymentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Payment/GetPayment',
            query: {
                'paymentId': paymentId,
            },
        });
    }
    /**
     * @returns SubscriptionPaymentDto Success
     * @throws ApiError
     */
    public static apiServicesAppPaymentGetlastcompletedpaymentGet(): CancelablePromise<SubscriptionPaymentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Payment/GetLastCompletedPayment',
        });
    }
    /**
     * @param paymentId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppPaymentPaymentfailedPost(
        paymentId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Payment/PaymentFailed',
            query: {
                'paymentId': paymentId,
            },
        });
    }
    /**
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppPaymentHasanypaymentPost(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Payment/HasAnyPayment',
        });
    }
}
