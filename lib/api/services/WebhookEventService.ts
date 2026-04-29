/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WebhookEvent } from '../models/WebhookEvent';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhookEventService {
    /**
     * @param id
     * @returns WebhookEvent Success
     * @throws ApiError
     */
    public static apiServicesAppWebhookeventGetGet(
        id?: string,
    ): CancelablePromise<WebhookEvent> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WebhookEvent/Get',
            query: {
                'id': id,
            },
        });
    }
}
