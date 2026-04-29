/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditUserSignalFollowDto } from '../models/CreateOrEditUserSignalFollowDto';
import type { FileDto } from '../models/FileDto';
import type { GetUserSignalFollowForEditOutput } from '../models/GetUserSignalFollowForEditOutput';
import type { GetUserSignalFollowForViewDto } from '../models/GetUserSignalFollowForViewDto';
import type { PagedResultDtoOfGetUserSignalFollowForViewDto } from '../models/PagedResultDtoOfGetUserSignalFollowForViewDto';
import type { PagedResultDtoOfUserSignalFollowSignalProviderLookupTableDto } from '../models/PagedResultDtoOfUserSignalFollowSignalProviderLookupTableDto';
import type { PagedResultDtoOfUserSignalFollowUserLookupTableDto } from '../models/PagedResultDtoOfUserSignalFollowUserLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserSignalFollowsService {
    /**
     * @param filter
     * @param maxFollowedAtFilter
     * @param minFollowedAtFilter
     * @param defaultExecutionTypeFilter
     * @param allowDemoSignalsFilter
     * @param allowRealSignalFilter
     * @param maxMaxRiskPerTradePercentFilter
     * @param minMaxRiskPerTradePercentFilter
     * @param maxMaxDailyLossPercentFilter
     * @param minMaxDailyLossPercentFilter
     * @param userNameFilter
     * @param signalProviderAiModelNameFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetUserSignalFollowForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsersignalfollowsGetallGet(
        filter?: string,
        maxFollowedAtFilter?: string,
        minFollowedAtFilter?: string,
        defaultExecutionTypeFilter?: number,
        allowDemoSignalsFilter?: number,
        allowRealSignalFilter?: number,
        maxMaxRiskPerTradePercentFilter?: number,
        minMaxRiskPerTradePercentFilter?: number,
        maxMaxDailyLossPercentFilter?: number,
        minMaxDailyLossPercentFilter?: number,
        userNameFilter?: string,
        signalProviderAiModelNameFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetUserSignalFollowForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserSignalFollows/GetAll',
            query: {
                'Filter': filter,
                'MaxFollowedAtFilter': maxFollowedAtFilter,
                'MinFollowedAtFilter': minFollowedAtFilter,
                'DefaultExecutionTypeFilter': defaultExecutionTypeFilter,
                'AllowDemoSignalsFilter': allowDemoSignalsFilter,
                'AllowRealSignalFilter': allowRealSignalFilter,
                'MaxMaxRiskPerTradePercentFilter': maxMaxRiskPerTradePercentFilter,
                'MinMaxRiskPerTradePercentFilter': minMaxRiskPerTradePercentFilter,
                'MaxMaxDailyLossPercentFilter': maxMaxDailyLossPercentFilter,
                'MinMaxDailyLossPercentFilter': minMaxDailyLossPercentFilter,
                'UserNameFilter': userNameFilter,
                'SignalProviderAIModelNameFilter': signalProviderAiModelNameFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetUserSignalFollowForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsersignalfollowsGetusersignalfollowforviewGet(
        id?: number,
    ): CancelablePromise<GetUserSignalFollowForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserSignalFollows/GetUserSignalFollowForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetUserSignalFollowForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUsersignalfollowsGetusersignalfollowforeditGet(
        id?: number,
    ): CancelablePromise<GetUserSignalFollowForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserSignalFollows/GetUserSignalFollowForEdit',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUsersignalfollowsCreateoreditPost(
        requestBody?: CreateOrEditUserSignalFollowDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserSignalFollows/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUsersignalfollowsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/UserSignalFollows/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param maxFollowedAtFilter
     * @param minFollowedAtFilter
     * @param defaultExecutionTypeFilter
     * @param allowDemoSignalsFilter
     * @param allowRealSignalFilter
     * @param maxMaxRiskPerTradePercentFilter
     * @param minMaxRiskPerTradePercentFilter
     * @param maxMaxDailyLossPercentFilter
     * @param minMaxDailyLossPercentFilter
     * @param userNameFilter
     * @param signalProviderAiModelNameFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsersignalfollowsGetusersignalfollowstoexcelGet(
        filter?: string,
        maxFollowedAtFilter?: string,
        minFollowedAtFilter?: string,
        defaultExecutionTypeFilter?: number,
        allowDemoSignalsFilter?: number,
        allowRealSignalFilter?: number,
        maxMaxRiskPerTradePercentFilter?: number,
        minMaxRiskPerTradePercentFilter?: number,
        maxMaxDailyLossPercentFilter?: number,
        minMaxDailyLossPercentFilter?: number,
        userNameFilter?: string,
        signalProviderAiModelNameFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserSignalFollows/GetUserSignalFollowsToExcel',
            query: {
                'Filter': filter,
                'MaxFollowedAtFilter': maxFollowedAtFilter,
                'MinFollowedAtFilter': minFollowedAtFilter,
                'DefaultExecutionTypeFilter': defaultExecutionTypeFilter,
                'AllowDemoSignalsFilter': allowDemoSignalsFilter,
                'AllowRealSignalFilter': allowRealSignalFilter,
                'MaxMaxRiskPerTradePercentFilter': maxMaxRiskPerTradePercentFilter,
                'MinMaxRiskPerTradePercentFilter': minMaxRiskPerTradePercentFilter,
                'MaxMaxDailyLossPercentFilter': maxMaxDailyLossPercentFilter,
                'MinMaxDailyLossPercentFilter': minMaxDailyLossPercentFilter,
                'UserNameFilter': userNameFilter,
                'SignalProviderAIModelNameFilter': signalProviderAiModelNameFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfUserSignalFollowUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsersignalfollowsGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfUserSignalFollowUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserSignalFollows/GetAllUserForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfUserSignalFollowSignalProviderLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppUsersignalfollowsGetallsignalproviderforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfUserSignalFollowSignalProviderLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserSignalFollows/GetAllSignalProviderForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
