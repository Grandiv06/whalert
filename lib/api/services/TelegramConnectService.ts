/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TelegramConnectLinkOutput } from '../models/TelegramConnectLinkOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TelegramConnectService {
    /**
     * @returns TelegramConnectLinkOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTelegramconnectGetconnectlinkGet(): CancelablePromise<TelegramConnectLinkOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TelegramConnect/GetConnectLink',
        });
    }
    /**
     * @param requestBody
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppTelegramconnectProcessupdatePost(
        requestBody?: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TelegramConnect/ProcessUpdate',
            query: {
                'requestBody': requestBody,
            },
        });
    }
}
