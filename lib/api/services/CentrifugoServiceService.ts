/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CentrifugoServiceService {
    /**
     * @param channel
     * @param requestBody
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppCentrifugoservicePublishPost(
        channel?: string,
        requestBody?: any,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/CentrifugoService/Publish',
            query: {
                'channel': channel,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
