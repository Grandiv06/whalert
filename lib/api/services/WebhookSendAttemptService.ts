/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListResultDtoOfGetAllSendAttemptsOfWebhookEventOutput } from '../models/ListResultDtoOfGetAllSendAttemptsOfWebhookEventOutput';
import type { PagedResultDtoOfGetAllSendAttemptsOutput } from '../models/PagedResultDtoOfGetAllSendAttemptsOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhookSendAttemptService {
    /**
     * @param subscriptionId
     * @param maxResultCount
     * @param skipCount
     * @returns PagedResultDtoOfGetAllSendAttemptsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksendattemptGetallsendattemptsGet(
        subscriptionId?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetAllSendAttemptsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WebhookSendAttempt/GetAllSendAttempts',
            query: {
                'SubscriptionId': subscriptionId,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @param id
     * @returns ListResultDtoOfGetAllSendAttemptsOfWebhookEventOutput Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksendattemptGetallsendattemptsofwebhookeventGet(
        id?: string,
    ): CancelablePromise<ListResultDtoOfGetAllSendAttemptsOfWebhookEventOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WebhookSendAttempt/GetAllSendAttemptsOfWebhookEvent',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param sendAttemptId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksendattemptResendPost(
        sendAttemptId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/WebhookSendAttempt/Resend',
            query: {
                'sendAttemptId': sendAttemptId,
            },
        });
    }
}
