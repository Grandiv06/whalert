/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaleConnectLinkOutput } from '../models/BaleConnectLinkOutput';
import type { BaleConnectSyncOutput } from '../models/BaleConnectSyncOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BaleConnectService {
    /**
     * @returns BaleConnectLinkOutput Success
     * @throws ApiError
     */
    public static apiServicesAppBaleconnectGetconnectlinkGet(): CancelablePromise<BaleConnectLinkOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/BaleConnect/GetConnectLink',
        });
    }
    /**
     * @param requestBody
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppBaleconnectProcessupdatePost(
        requestBody?: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/BaleConnect/ProcessUpdate',
            query: {
                'requestBody': requestBody,
            },
        });
    }
    /**
     * @returns BaleConnectSyncOutput Success
     * @throws ApiError
     */
    public static apiServicesAppBaleconnectSyncconnectfrombotupdatesPost(): CancelablePromise<BaleConnectSyncOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/BaleConnect/SyncConnectFromBotUpdates',
        });
    }
}
