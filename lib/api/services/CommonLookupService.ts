/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FindUsersInput } from '../models/FindUsersInput';
import type { GetDefaultEditionNameOutput } from '../models/GetDefaultEditionNameOutput';
import type { ListResultDtoOfSubscribableEditionComboboxItemDto } from '../models/ListResultDtoOfSubscribableEditionComboboxItemDto';
import type { PagedResultDtoOfFindUsersOutputDto } from '../models/PagedResultDtoOfFindUsersOutputDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommonLookupService {
    /**
     * @param onlyFreeItems
     * @returns ListResultDtoOfSubscribableEditionComboboxItemDto Success
     * @throws ApiError
     */
    public static apiServicesAppCommonlookupGeteditionsforcomboboxGet(
        onlyFreeItems: boolean = false,
    ): CancelablePromise<ListResultDtoOfSubscribableEditionComboboxItemDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/CommonLookup/GetEditionsForCombobox',
            query: {
                'onlyFreeItems': onlyFreeItems,
            },
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfFindUsersOutputDto Success
     * @throws ApiError
     */
    public static apiServicesAppCommonlookupFindusersPost(
        requestBody?: FindUsersInput,
    ): CancelablePromise<PagedResultDtoOfFindUsersOutputDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/CommonLookup/FindUsers',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns GetDefaultEditionNameOutput Success
     * @throws ApiError
     */
    public static apiServicesAppCommonlookupGetdefaulteditionnameGet(): CancelablePromise<GetDefaultEditionNameOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/CommonLookup/GetDefaultEditionName',
        });
    }
}
