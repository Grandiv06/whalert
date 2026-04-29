/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TelegramNotificationServiceService {
    /**
     * @param telegramId
     * @param text
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppTelegramnotificationserviceSendmessagePost(
        telegramId?: string,
        text?: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TelegramNotificationService/SendMessage',
            query: {
                'telegramId': telegramId,
                'text': text,
            },
        });
    }
}
