/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditPositionResultDto } from '../models/CreateOrEditPositionResultDto';
import type { FileDto } from '../models/FileDto';
import type { GetPositionResultForEditOutput } from '../models/GetPositionResultForEditOutput';
import type { GetPositionResultForViewDto } from '../models/GetPositionResultForViewDto';
import type { PagedResultDtoOfGetPositionResultForViewDto } from '../models/PagedResultDtoOfGetPositionResultForViewDto';
import type { PagedResultDtoOfPositionResultSignalExecutionLookupTableDto } from '../models/PagedResultDtoOfPositionResultSignalExecutionLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PositionResultsService {
    /**
     * @param filter
     * @param maxExitPriceFilter
     * @param minExitPriceFilter
     * @param maxExitAtFilter
     * @param minExitAtFilter
     * @param maxPnLFilter
     * @param minPnLFilter
     * @param maxPnLPercentFilter
     * @param minPnLPercentFilter
     * @param maxRewardRiskFilter
     * @param minRewardRiskFilter
     * @param isSuccessFilter
     * @param signalExecutionKeyFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetPositionResultForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppPositionresultsGetallGet(
        filter?: string,
        maxExitPriceFilter?: number,
        minExitPriceFilter?: number,
        maxExitAtFilter?: string,
        minExitAtFilter?: string,
        maxPnLFilter?: number,
        minPnLFilter?: number,
        maxPnLPercentFilter?: number,
        minPnLPercentFilter?: number,
        maxRewardRiskFilter?: number,
        minRewardRiskFilter?: number,
        isSuccessFilter?: number,
        signalExecutionKeyFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetPositionResultForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/PositionResults/GetAll',
            query: {
                'Filter': filter,
                'MaxExitPriceFilter': maxExitPriceFilter,
                'MinExitPriceFilter': minExitPriceFilter,
                'MaxExitAtFilter': maxExitAtFilter,
                'MinExitAtFilter': minExitAtFilter,
                'MaxPnLFilter': maxPnLFilter,
                'MinPnLFilter': minPnLFilter,
                'MaxPnLPercentFilter': maxPnLPercentFilter,
                'MinPnLPercentFilter': minPnLPercentFilter,
                'MaxRewardRiskFilter': maxRewardRiskFilter,
                'MinRewardRiskFilter': minRewardRiskFilter,
                'IsSuccessFilter': isSuccessFilter,
                'SignalExecutionKeyFilter': signalExecutionKeyFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetPositionResultForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppPositionresultsGetpositionresultforviewGet(
        id?: number,
    ): CancelablePromise<GetPositionResultForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/PositionResults/GetPositionResultForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetPositionResultForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppPositionresultsGetpositionresultforeditGet(
        id?: number,
    ): CancelablePromise<GetPositionResultForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/PositionResults/GetPositionResultForEdit',
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
    public static apiServicesAppPositionresultsCreateoreditPost(
        requestBody?: CreateOrEditPositionResultDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/PositionResults/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppPositionresultsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/PositionResults/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param maxExitPriceFilter
     * @param minExitPriceFilter
     * @param maxExitAtFilter
     * @param minExitAtFilter
     * @param maxPnLFilter
     * @param minPnLFilter
     * @param maxPnLPercentFilter
     * @param minPnLPercentFilter
     * @param maxRewardRiskFilter
     * @param minRewardRiskFilter
     * @param isSuccessFilter
     * @param signalExecutionKeyFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppPositionresultsGetpositionresultstoexcelGet(
        filter?: string,
        maxExitPriceFilter?: number,
        minExitPriceFilter?: number,
        maxExitAtFilter?: string,
        minExitAtFilter?: string,
        maxPnLFilter?: number,
        minPnLFilter?: number,
        maxPnLPercentFilter?: number,
        minPnLPercentFilter?: number,
        maxRewardRiskFilter?: number,
        minRewardRiskFilter?: number,
        isSuccessFilter?: number,
        signalExecutionKeyFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/PositionResults/GetPositionResultsToExcel',
            query: {
                'Filter': filter,
                'MaxExitPriceFilter': maxExitPriceFilter,
                'MinExitPriceFilter': minExitPriceFilter,
                'MaxExitAtFilter': maxExitAtFilter,
                'MinExitAtFilter': minExitAtFilter,
                'MaxPnLFilter': maxPnLFilter,
                'MinPnLFilter': minPnLFilter,
                'MaxPnLPercentFilter': maxPnLPercentFilter,
                'MinPnLPercentFilter': minPnLPercentFilter,
                'MaxRewardRiskFilter': maxRewardRiskFilter,
                'MinRewardRiskFilter': minRewardRiskFilter,
                'IsSuccessFilter': isSuccessFilter,
                'SignalExecutionKeyFilter': signalExecutionKeyFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfPositionResultSignalExecutionLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppPositionresultsGetallsignalexecutionforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfPositionResultSignalExecutionLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/PositionResults/GetAllSignalExecutionForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
