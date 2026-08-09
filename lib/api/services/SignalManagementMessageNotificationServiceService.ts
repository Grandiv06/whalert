/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TradingSignal } from '../models/TradingSignal';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignalManagementMessageNotificationServiceService {
    /**
     * @param messageBody
     * @param authorUserId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalmanagementmessagenotificationserviceNotifyeligibleusersPost(
        messageBody?: string,
        authorUserId?: number,
        requestBody?: TradingSignal,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalManagementMessageNotificationService/NotifyEligibleUsers',
            query: {
                'messageBody': messageBody,
                'authorUserId': authorUserId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
