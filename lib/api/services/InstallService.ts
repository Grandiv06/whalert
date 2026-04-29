/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppSettingsJsonDto } from '../models/AppSettingsJsonDto';
import type { CheckDatabaseOutput } from '../models/CheckDatabaseOutput';
import type { InstallDto } from '../models/InstallDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InstallService {
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppInstallSetupPost(
        requestBody?: InstallDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Install/Setup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns AppSettingsJsonDto Success
     * @throws ApiError
     */
    public static apiServicesAppInstallGetappsettingsjsonGet(): CancelablePromise<AppSettingsJsonDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Install/GetAppSettingsJson',
        });
    }
    /**
     * @returns CheckDatabaseOutput Success
     * @throws ApiError
     */
    public static apiServicesAppInstallCheckdatabasePost(): CancelablePromise<CheckDatabaseOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Install/CheckDatabase',
        });
    }
}
