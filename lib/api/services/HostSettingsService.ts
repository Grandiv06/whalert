/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalLoginSettingsDto } from '../models/ExternalLoginSettingsDto';
import type { HostSettingsEditDto } from '../models/HostSettingsEditDto';
import type { SendTestEmailInput } from '../models/SendTestEmailInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HostSettingsService {
    /**
     * @returns HostSettingsEditDto Success
     * @throws ApiError
     */
    public static apiServicesAppHostsettingsGetallsettingsGet(): CancelablePromise<HostSettingsEditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/HostSettings/GetAllSettings',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppHostsettingsUpdateallsettingsPut(
        requestBody?: HostSettingsEditDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/HostSettings/UpdateAllSettings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppHostsettingsSendtestemailPost(
        requestBody?: SendTestEmailInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/HostSettings/SendTestEmail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ExternalLoginSettingsDto Success
     * @throws ApiError
     */
    public static apiServicesAppHostsettingsGetenabledsocialloginsettingsGet(): CancelablePromise<ExternalLoginSettingsDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/HostSettings/GetEnabledSocialLoginSettings',
        });
    }
}
