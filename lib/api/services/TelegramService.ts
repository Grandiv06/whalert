/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TelegramService {
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiTelegramWebhookPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/telegram/webhook',
        });
    }
}
