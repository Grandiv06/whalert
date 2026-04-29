/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CentrifugoConnectionInfoDto } from '../models/CentrifugoConnectionInfoDto';
import type { CentrifugoStatusDto } from '../models/CentrifugoStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CentrifugoConnectionService {
    /**
     * @returns CentrifugoConnectionInfoDto Success
     * @throws ApiError
     */
    public static apiServicesAppCentrifugoconnectionGetconnectioninfoGet(): CancelablePromise<CentrifugoConnectionInfoDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/CentrifugoConnection/GetConnectionInfo',
        });
    }
    /**
     * @returns CentrifugoStatusDto Success
     * @throws ApiError
     */
    public static apiServicesAppCentrifugoconnectionGetstatusGet(): CancelablePromise<CentrifugoStatusDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/CentrifugoConnection/GetStatus',
        });
    }
}
