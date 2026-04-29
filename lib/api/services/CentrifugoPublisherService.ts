/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CentrifugoPublisherService {
    /**
     * @param channel
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppCentrifugopublisherPublishPost(
        channel?: string,
        requestBody?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/CentrifugoPublisher/Publish',
            query: {
                'channel': channel,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
