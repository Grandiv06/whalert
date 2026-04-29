/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalLoginSettingsDto } from '../models/ExternalLoginSettingsDto';
import type { SendTestEmailInput } from '../models/SendTestEmailInput';
import type { TenantSettingsEditDto } from '../models/TenantSettingsEditDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TenantSettingsService {
    /**
     * @returns TenantSettingsEditDto Success
     * @throws ApiError
     */
    public static apiServicesAppTenantsettingsGetallsettingsGet(): CancelablePromise<TenantSettingsEditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantSettings/GetAllSettings',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantsettingsUpdateallsettingsPut(
        requestBody?: TenantSettingsEditDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/TenantSettings/UpdateAllSettings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantsettingsCleardarklogoPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantSettings/ClearDarkLogo',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantsettingsCleardarklogominimalPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantSettings/ClearDarkLogoMinimal',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantsettingsClearlightlogoPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantSettings/ClearLightLogo',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantsettingsClearlightlogominimalPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantSettings/ClearLightLogoMinimal',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantsettingsClearcustomcssPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantSettings/ClearCustomCss',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTenantsettingsSendtestemailPost(
        requestBody?: SendTestEmailInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TenantSettings/SendTestEmail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ExternalLoginSettingsDto Success
     * @throws ApiError
     */
    public static apiServicesAppTenantsettingsGetenabledsocialloginsettingsGet(): CancelablePromise<ExternalLoginSettingsDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantSettings/GetEnabledSocialLoginSettings',
        });
    }
}
