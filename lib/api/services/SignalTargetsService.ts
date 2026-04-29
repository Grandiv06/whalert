/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditSignalTargetDto } from '../models/CreateOrEditSignalTargetDto';
import type { FileDto } from '../models/FileDto';
import type { GetSignalTargetForEditOutput } from '../models/GetSignalTargetForEditOutput';
import type { GetSignalTargetForViewDto } from '../models/GetSignalTargetForViewDto';
import type { PagedResultDtoOfGetSignalTargetForViewDto } from '../models/PagedResultDtoOfGetSignalTargetForViewDto';
import type { PagedResultDtoOfSignalTargetTradingSignalLookupTableDto } from '../models/PagedResultDtoOfSignalTargetTradingSignalLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignalTargetsService {
    /**
     * @param filter
     * @param maxTargetPriceFilter
     * @param minTargetPriceFilter
     * @param maxMarginFilter
     * @param minMarginFilter
     * @param targetTypeFilter
     * @param tradingSignalTradingViewAnalysisUrlFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetSignalTargetForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignaltargetsGetallGet(
        filter?: string,
        maxTargetPriceFilter?: number,
        minTargetPriceFilter?: number,
        maxMarginFilter?: number,
        minMarginFilter?: number,
        targetTypeFilter?: number,
        tradingSignalTradingViewAnalysisUrlFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetSignalTargetForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalTargets/GetAll',
            query: {
                'Filter': filter,
                'MaxTargetPriceFilter': maxTargetPriceFilter,
                'MinTargetPriceFilter': minTargetPriceFilter,
                'MaxMarginFilter': maxMarginFilter,
                'MinMarginFilter': minMarginFilter,
                'TargetTypeFilter': targetTypeFilter,
                'TradingSignalTradingViewAnalysisUrlFilter': tradingSignalTradingViewAnalysisUrlFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetSignalTargetForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignaltargetsGetsignaltargetforviewGet(
        id?: number,
    ): CancelablePromise<GetSignalTargetForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalTargets/GetSignalTargetForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetSignalTargetForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignaltargetsGetsignaltargetforeditGet(
        id?: number,
    ): CancelablePromise<GetSignalTargetForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalTargets/GetSignalTargetForEdit',
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
    public static apiServicesAppSignaltargetsCreateoreditPost(
        requestBody?: CreateOrEditSignalTargetDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalTargets/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignaltargetsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/SignalTargets/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param maxTargetPriceFilter
     * @param minTargetPriceFilter
     * @param maxMarginFilter
     * @param minMarginFilter
     * @param targetTypeFilter
     * @param tradingSignalTradingViewAnalysisUrlFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignaltargetsGetsignaltargetstoexcelGet(
        filter?: string,
        maxTargetPriceFilter?: number,
        minTargetPriceFilter?: number,
        maxMarginFilter?: number,
        minMarginFilter?: number,
        targetTypeFilter?: number,
        tradingSignalTradingViewAnalysisUrlFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalTargets/GetSignalTargetsToExcel',
            query: {
                'Filter': filter,
                'MaxTargetPriceFilter': maxTargetPriceFilter,
                'MinTargetPriceFilter': minTargetPriceFilter,
                'MaxMarginFilter': maxMarginFilter,
                'MinMarginFilter': minMarginFilter,
                'TargetTypeFilter': targetTypeFilter,
                'TradingSignalTradingViewAnalysisUrlFilter': tradingSignalTradingViewAnalysisUrlFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfSignalTargetTradingSignalLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignaltargetsGetalltradingsignalforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfSignalTargetTradingSignalLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalTargets/GetAllTradingSignalForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
