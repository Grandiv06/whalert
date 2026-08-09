/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaleTestSendRequest } from '../models/BaleTestSendRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BaleService {
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiBaleWebhookPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bale/webhook',
        });
    }
    /**
     * @param secret
     * @returns any Success
     * @throws ApiError
     */
    public static apiBaleTestStatusGet(
        secret?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bale/test-status',
            query: {
                'secret': secret,
            },
        });
    }
    /**
     * @param text
     * @param chatId
     * @param secret
     * @returns any Success
     * @throws ApiError
     */
    public static apiBaleTestSendGet(
        text: string = 'WhAlert Bale test',
        chatId: string = 'iliamrd84',
        secret?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bale/test-send',
            query: {
                'text': text,
                'chatId': chatId,
                'secret': secret,
            },
        });
    }
    /**
     * @param secret
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiBaleTestSendPost(
        secret?: string,
        requestBody?: BaleTestSendRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bale/test-send',
            query: {
                'secret': secret,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
