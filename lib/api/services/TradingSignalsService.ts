/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditTradingSignalDto } from '../models/CreateOrEditTradingSignalDto';
import type { FileDto } from '../models/FileDto';
import type { GetTradingSignalForEditOutput } from '../models/GetTradingSignalForEditOutput';
import type { GetTradingSignalForViewDto } from '../models/GetTradingSignalForViewDto';
import type { PagedResultDtoOfGetTradingSignalForViewDto } from '../models/PagedResultDtoOfGetTradingSignalForViewDto';
import type { PagedResultDtoOfTradingSignalMarketLookupTableDto } from '../models/PagedResultDtoOfTradingSignalMarketLookupTableDto';
import type { PagedResultDtoOfTradingSignalSignalProviderLookupTableDto } from '../models/PagedResultDtoOfTradingSignalSignalProviderLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TradingSignalsService {
    /**
     * @param filter
     * @param sideFilter
     * @param maxEntryPointFilter
     * @param minEntryPointFilter
     * @param maxStopLossFilter
     * @param minStopLossFilter
     * @param maxLeverageFilter
     * @param minLeverageFilter
     * @param maxRiskRewardRatioFilter
     * @param minRiskRewardRatioFilter
     * @param tradingViewAnalysisUrlFilter
     * @param pictureUrlFilter
     * @param signalStatusFilter
     * @param signalVisibilityFilter
     * @param maxExpiresAtFilter
     * @param minExpiresAtFilter
     * @param marketSymbolFilter
     * @param signalProviderAiModelNameFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetTradingSignalForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppTradingsignalsGetallGet(
        filter?: string,
        sideFilter?: number,
        maxEntryPointFilter?: number,
        minEntryPointFilter?: number,
        maxStopLossFilter?: number,
        minStopLossFilter?: number,
        maxLeverageFilter?: number,
        minLeverageFilter?: number,
        maxRiskRewardRatioFilter?: number,
        minRiskRewardRatioFilter?: number,
        tradingViewAnalysisUrlFilter?: string,
        pictureUrlFilter?: string,
        signalStatusFilter?: number,
        signalVisibilityFilter?: number,
        maxExpiresAtFilter?: string,
        minExpiresAtFilter?: string,
        marketSymbolFilter?: string,
        signalProviderAiModelNameFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetTradingSignalForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TradingSignals/GetAll',
            query: {
                'Filter': filter,
                'SideFilter': sideFilter,
                'MaxEntryPointFilter': maxEntryPointFilter,
                'MinEntryPointFilter': minEntryPointFilter,
                'MaxStopLossFilter': maxStopLossFilter,
                'MinStopLossFilter': minStopLossFilter,
                'MaxLeverageFilter': maxLeverageFilter,
                'MinLeverageFilter': minLeverageFilter,
                'MaxRiskRewardRatioFilter': maxRiskRewardRatioFilter,
                'MinRiskRewardRatioFilter': minRiskRewardRatioFilter,
                'TradingViewAnalysisUrlFilter': tradingViewAnalysisUrlFilter,
                'PictureUrlFilter': pictureUrlFilter,
                'SignalStatusFilter': signalStatusFilter,
                'SignalVisibilityFilter': signalVisibilityFilter,
                'MaxExpiresAtFilter': maxExpiresAtFilter,
                'MinExpiresAtFilter': minExpiresAtFilter,
                'MarketSymbolFilter': marketSymbolFilter,
                'SignalProviderAIModelNameFilter': signalProviderAiModelNameFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetTradingSignalForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppTradingsignalsGettradingsignalforviewGet(
        id?: number,
    ): CancelablePromise<GetTradingSignalForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TradingSignals/GetTradingSignalForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetTradingSignalForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTradingsignalsGettradingsignalforeditGet(
        id?: number,
    ): CancelablePromise<GetTradingSignalForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TradingSignals/GetTradingSignalForEdit',
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
    public static apiServicesAppTradingsignalsCreateoreditPost(
        requestBody?: CreateOrEditTradingSignalDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/TradingSignals/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTradingsignalsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/TradingSignals/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param sideFilter
     * @param maxEntryPointFilter
     * @param minEntryPointFilter
     * @param maxStopLossFilter
     * @param minStopLossFilter
     * @param maxLeverageFilter
     * @param minLeverageFilter
     * @param maxRiskRewardRatioFilter
     * @param minRiskRewardRatioFilter
     * @param tradingViewAnalysisUrlFilter
     * @param pictureUrlFilter
     * @param signalStatusFilter
     * @param signalVisibilityFilter
     * @param maxExpiresAtFilter
     * @param minExpiresAtFilter
     * @param marketSymbolFilter
     * @param signalProviderAiModelNameFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppTradingsignalsGettradingsignalstoexcelGet(
        filter?: string,
        sideFilter?: number,
        maxEntryPointFilter?: number,
        minEntryPointFilter?: number,
        maxStopLossFilter?: number,
        minStopLossFilter?: number,
        maxLeverageFilter?: number,
        minLeverageFilter?: number,
        maxRiskRewardRatioFilter?: number,
        minRiskRewardRatioFilter?: number,
        tradingViewAnalysisUrlFilter?: string,
        pictureUrlFilter?: string,
        signalStatusFilter?: number,
        signalVisibilityFilter?: number,
        maxExpiresAtFilter?: string,
        minExpiresAtFilter?: string,
        marketSymbolFilter?: string,
        signalProviderAiModelNameFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TradingSignals/GetTradingSignalsToExcel',
            query: {
                'Filter': filter,
                'SideFilter': sideFilter,
                'MaxEntryPointFilter': maxEntryPointFilter,
                'MinEntryPointFilter': minEntryPointFilter,
                'MaxStopLossFilter': maxStopLossFilter,
                'MinStopLossFilter': minStopLossFilter,
                'MaxLeverageFilter': maxLeverageFilter,
                'MinLeverageFilter': minLeverageFilter,
                'MaxRiskRewardRatioFilter': maxRiskRewardRatioFilter,
                'MinRiskRewardRatioFilter': minRiskRewardRatioFilter,
                'TradingViewAnalysisUrlFilter': tradingViewAnalysisUrlFilter,
                'PictureUrlFilter': pictureUrlFilter,
                'SignalStatusFilter': signalStatusFilter,
                'SignalVisibilityFilter': signalVisibilityFilter,
                'MaxExpiresAtFilter': maxExpiresAtFilter,
                'MinExpiresAtFilter': minExpiresAtFilter,
                'MarketSymbolFilter': marketSymbolFilter,
                'SignalProviderAIModelNameFilter': signalProviderAiModelNameFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfTradingSignalMarketLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppTradingsignalsGetallmarketforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfTradingSignalMarketLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TradingSignals/GetAllMarketForLookupTable',
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
     * @returns PagedResultDtoOfTradingSignalSignalProviderLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppTradingsignalsGetallsignalproviderforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfTradingSignalSignalProviderLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TradingSignals/GetAllSignalProviderForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppTradingsignalsRemovepicturefileDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/TradingSignals/RemovePictureFile',
            query: {
                'Id': id,
            },
        });
    }
}
