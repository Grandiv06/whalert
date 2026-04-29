/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditSignalExecutionDto } from '../models/CreateOrEditSignalExecutionDto';
import type { FileDto } from '../models/FileDto';
import type { GetSignalExecutionForEditOutput } from '../models/GetSignalExecutionForEditOutput';
import type { GetSignalExecutionForViewDto } from '../models/GetSignalExecutionForViewDto';
import type { PagedResultDtoOfGetSignalExecutionForViewDto } from '../models/PagedResultDtoOfGetSignalExecutionForViewDto';
import type { PagedResultDtoOfSignalExecutionTradingSignalLookupTableDto } from '../models/PagedResultDtoOfSignalExecutionTradingSignalLookupTableDto';
import type { PagedResultDtoOfSignalExecutionUserLookupTableDto } from '../models/PagedResultDtoOfSignalExecutionUserLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignalExecutionsService {
    /**
     * @param filter
     * @param providerTypeFilter
     * @param execTypeFilter
     * @param maxEntryPriceFilter
     * @param minEntryPriceFilter
     * @param executionStatusFilter
     * @param maxExecutedAtFilter
     * @param minExecutedAtFilter
     * @param maxMarginUsedFilter
     * @param minMarginUsedFilter
     * @param keyFilter
     * @param tradingSignalTradingViewAnalysisUrlFilter
     * @param userNameFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetSignalExecutionForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalexecutionsGetallGet(
        filter?: string,
        providerTypeFilter?: number,
        execTypeFilter?: number,
        maxEntryPriceFilter?: number,
        minEntryPriceFilter?: number,
        executionStatusFilter?: number,
        maxExecutedAtFilter?: string,
        minExecutedAtFilter?: string,
        maxMarginUsedFilter?: number,
        minMarginUsedFilter?: number,
        keyFilter?: string,
        tradingSignalTradingViewAnalysisUrlFilter?: string,
        userNameFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetSignalExecutionForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalExecutions/GetAll',
            query: {
                'Filter': filter,
                'ProviderTypeFilter': providerTypeFilter,
                'ExecTypeFilter': execTypeFilter,
                'MaxEntryPriceFilter': maxEntryPriceFilter,
                'MinEntryPriceFilter': minEntryPriceFilter,
                'ExecutionStatusFilter': executionStatusFilter,
                'MaxExecutedAtFilter': maxExecutedAtFilter,
                'MinExecutedAtFilter': minExecutedAtFilter,
                'MaxMarginUsedFilter': maxMarginUsedFilter,
                'MinMarginUsedFilter': minMarginUsedFilter,
                'KeyFilter': keyFilter,
                'TradingSignalTradingViewAnalysisUrlFilter': tradingSignalTradingViewAnalysisUrlFilter,
                'UserNameFilter': userNameFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetSignalExecutionForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalexecutionsGetsignalexecutionforviewGet(
        id?: number,
    ): CancelablePromise<GetSignalExecutionForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalExecutions/GetSignalExecutionForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetSignalExecutionForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalexecutionsGetsignalexecutionforeditGet(
        id?: number,
    ): CancelablePromise<GetSignalExecutionForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalExecutions/GetSignalExecutionForEdit',
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
    public static apiServicesAppSignalexecutionsCreateoreditPost(
        requestBody?: CreateOrEditSignalExecutionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalExecutions/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalexecutionsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/SignalExecutions/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param providerTypeFilter
     * @param execTypeFilter
     * @param maxEntryPriceFilter
     * @param minEntryPriceFilter
     * @param executionStatusFilter
     * @param maxExecutedAtFilter
     * @param minExecutedAtFilter
     * @param maxMarginUsedFilter
     * @param minMarginUsedFilter
     * @param keyFilter
     * @param tradingSignalTradingViewAnalysisUrlFilter
     * @param userNameFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalexecutionsGetsignalexecutionstoexcelGet(
        filter?: string,
        providerTypeFilter?: number,
        execTypeFilter?: number,
        maxEntryPriceFilter?: number,
        minEntryPriceFilter?: number,
        executionStatusFilter?: number,
        maxExecutedAtFilter?: string,
        minExecutedAtFilter?: string,
        maxMarginUsedFilter?: number,
        minMarginUsedFilter?: number,
        keyFilter?: string,
        tradingSignalTradingViewAnalysisUrlFilter?: string,
        userNameFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalExecutions/GetSignalExecutionsToExcel',
            query: {
                'Filter': filter,
                'ProviderTypeFilter': providerTypeFilter,
                'ExecTypeFilter': execTypeFilter,
                'MaxEntryPriceFilter': maxEntryPriceFilter,
                'MinEntryPriceFilter': minEntryPriceFilter,
                'ExecutionStatusFilter': executionStatusFilter,
                'MaxExecutedAtFilter': maxExecutedAtFilter,
                'MinExecutedAtFilter': minExecutedAtFilter,
                'MaxMarginUsedFilter': maxMarginUsedFilter,
                'MinMarginUsedFilter': minMarginUsedFilter,
                'KeyFilter': keyFilter,
                'TradingSignalTradingViewAnalysisUrlFilter': tradingSignalTradingViewAnalysisUrlFilter,
                'UserNameFilter': userNameFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfSignalExecutionTradingSignalLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalexecutionsGetalltradingsignalforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfSignalExecutionTradingSignalLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalExecutions/GetAllTradingSignalForLookupTable',
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
     * @returns PagedResultDtoOfSignalExecutionUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalexecutionsGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfSignalExecutionUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalExecutions/GetAllUserForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
