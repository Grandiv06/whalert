/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TradingSignal } from '../models/TradingSignal';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignalPublishedNotificationServiceService {
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalpublishednotificationserviceNotifyfollowersPost(
        requestBody?: TradingSignal,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalPublishedNotificationService/NotifyFollowers',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
