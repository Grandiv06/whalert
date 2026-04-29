/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Mt5AckSignalInput } from '../models/Mt5AckSignalInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Mt5Service {
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppMt5GetpendingsignalsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Mt5/GetPendingSignals',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppMt5AcksignalPost(
        requestBody?: Mt5AckSignalInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Mt5/AckSignal',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
