/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DateFieldOutput } from '../models/DateFieldOutput';
import type { DateRangeFieldOutput } from '../models/DateRangeFieldOutput';
import type { DateWithTextFieldOutput } from '../models/DateWithTextFieldOutput';
import type { NameValueOfString } from '../models/NameValueOfString';
import type { SendAndGetDateWithTextInput } from '../models/SendAndGetDateWithTextInput';
import type { StringOutput } from '../models/StringOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DemoUiComponentsService {
    /**
     * @param date
     * @returns DateFieldOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDemouicomponentsSendandgetdatePost(
        date?: string,
    ): CancelablePromise<DateFieldOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DemoUiComponents/SendAndGetDate',
            query: {
                'date': date,
            },
        });
    }
    /**
     * @param date
     * @returns DateFieldOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDemouicomponentsSendandgetdatetimePost(
        date?: string,
    ): CancelablePromise<DateFieldOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DemoUiComponents/SendAndGetDateTime',
            query: {
                'date': date,
            },
        });
    }
    /**
     * @param startDate
     * @param endDate
     * @returns DateRangeFieldOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDemouicomponentsSendandgetdaterangePost(
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<DateRangeFieldOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DemoUiComponents/SendAndGetDateRange',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * @param requestBody
     * @returns DateWithTextFieldOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDemouicomponentsSendandgetdatewithtextPost(
        requestBody?: SendAndGetDateWithTextInput,
    ): CancelablePromise<DateWithTextFieldOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DemoUiComponents/SendAndGetDateWithText',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param searchTerm
     * @returns NameValueOfString Success
     * @throws ApiError
     */
    public static apiServicesAppDemouicomponentsGetcountriesGet(
        searchTerm?: string,
    ): CancelablePromise<Array<NameValueOfString>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DemoUiComponents/GetCountries',
            query: {
                'searchTerm': searchTerm,
            },
        });
    }
    /**
     * @param requestBody
     * @returns NameValueOfString Success
     * @throws ApiError
     */
    public static apiServicesAppDemouicomponentsSendandgetselectedcountriesPost(
        requestBody?: Array<NameValueOfString>,
    ): CancelablePromise<Array<NameValueOfString>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DemoUiComponents/SendAndGetSelectedCountries',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param input
     * @returns StringOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDemouicomponentsSendandgetvaluePost(
        input?: string,
    ): CancelablePromise<StringOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DemoUiComponents/SendAndGetValue',
            query: {
                'input': input,
            },
        });
    }
}
