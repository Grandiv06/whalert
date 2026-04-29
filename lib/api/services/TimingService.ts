/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComboboxItemDto } from '../models/ComboboxItemDto';
import type { ListResultDtoOfNameValueDto } from '../models/ListResultDtoOfNameValueDto';
import type { SettingScopes } from '../models/SettingScopes';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TimingService {
    /**
     * @param defaultTimezoneScope
     * @returns ListResultDtoOfNameValueDto Success
     * @throws ApiError
     */
    public static apiServicesAppTimingGettimezonesGet(
        defaultTimezoneScope?: SettingScopes,
    ): CancelablePromise<ListResultDtoOfNameValueDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Timing/GetTimezones',
            query: {
                'DefaultTimezoneScope': defaultTimezoneScope,
            },
        });
    }
    /**
     * @param selectedTimezoneId
     * @returns ComboboxItemDto Success
     * @throws ApiError
     */
    public static apiServicesAppTimingGettimezonecomboboxitemsGet(
        selectedTimezoneId?: string,
    ): CancelablePromise<Array<ComboboxItemDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Timing/GetTimezoneComboboxItems',
            query: {
                'SelectedTimezoneId': selectedTimezoneId,
            },
        });
    }
}
