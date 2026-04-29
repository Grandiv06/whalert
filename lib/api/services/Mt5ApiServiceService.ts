/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Mt5PendingSignalsOutput } from '../models/Mt5PendingSignalsOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Mt5ApiServiceService {
    /**
     * @param userId
     * @param tenantId
     * @returns Mt5PendingSignalsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppMt5ApiserviceGetpendingsignalsGet(
        userId?: number,
        tenantId?: number,
    ): CancelablePromise<Mt5PendingSignalsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Mt5ApiService/GetPendingSignals',
            query: {
                'userId': userId,
                'tenantId': tenantId,
            },
        });
    }
    /**
     * @param tenantId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppMt5ApiserviceAcksignalPost(
        tenantId?: number,
        requestBody?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Mt5ApiService/AckSignal',
            query: {
                'tenantId': tenantId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
