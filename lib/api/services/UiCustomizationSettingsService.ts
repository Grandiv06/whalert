/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ThemeSettingsDto } from '../models/ThemeSettingsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UiCustomizationSettingsService {
    /**
     * @returns ThemeSettingsDto Success
     * @throws ApiError
     */
    public static apiServicesAppUicustomizationsettingsGetuimanagementsettingsGet(): CancelablePromise<Array<ThemeSettingsDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UiCustomizationSettings/GetUiManagementSettings',
        });
    }
    /**
     * @param themeName
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUicustomizationsettingsChangethemewithdefaultvaluesPost(
        themeName?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UiCustomizationSettings/ChangeThemeWithDefaultValues',
            query: {
                'themeName': themeName,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUicustomizationsettingsUpdateuimanagementsettingsPut(
        requestBody?: ThemeSettingsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/UiCustomizationSettings/UpdateUiManagementSettings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUicustomizationsettingsUpdatedefaultuimanagementsettingsPut(
        requestBody?: ThemeSettingsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/UiCustomizationSettings/UpdateDefaultUiManagementSettings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUicustomizationsettingsUsesystemdefaultsettingsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UiCustomizationSettings/UseSystemDefaultSettings',
        });
    }
    /**
     * @param isDarkModeActive
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUicustomizationsettingsChangedarkmodeofcurrentthemePost(
        isDarkModeActive?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UiCustomizationSettings/ChangeDarkModeOfCurrentTheme',
            query: {
                'isDarkModeActive': isDarkModeActive,
            },
        });
    }
}
