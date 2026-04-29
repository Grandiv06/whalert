/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DynamicPriceCandlesResponseDto } from '../models/DynamicPriceCandlesResponseDto';
import type { GlobalGoldRecordDto } from '../models/GlobalGoldRecordDto';
import type { MesghalSeriesPointDto } from '../models/MesghalSeriesPointDto';
import type { MesghalSnapshotDto } from '../models/MesghalSnapshotDto';
import type { SaveMesghalSnapshotInput } from '../models/SaveMesghalSnapshotInput';
import type { SaveMesghalSnapshotResultDto } from '../models/SaveMesghalSnapshotResultDto';
import type { TgjuMesghalHistoryRecordDto } from '../models/TgjuMesghalHistoryRecordDto';
import type { TgjuMesghalSeriesPointDto } from '../models/TgjuMesghalSeriesPointDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriceService {
    /**
     * @param sourceUrl
     * @param timeoutSeconds
     * @returns MesghalSnapshotDto Success
     * @throws ApiError
     */
    public static apiServicesAppPriceGetmesghalsnapshotGet(
        sourceUrl?: string,
        timeoutSeconds?: number,
    ): CancelablePromise<MesghalSnapshotDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Price/GetMesghalSnapshot',
            query: {
                'SourceUrl': sourceUrl,
                'TimeoutSeconds': timeoutSeconds,
            },
        });
    }
    /**
     * @param requestBody
     * @returns SaveMesghalSnapshotResultDto Success
     * @throws ApiError
     */
    public static apiServicesAppPriceSavemesghalsnapshotPost(
        requestBody?: SaveMesghalSnapshotInput,
    ): CancelablePromise<SaveMesghalSnapshotResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Price/SaveMesghalSnapshot',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param fromDate
     * @param toDate
     * @param limit
     * @param timeoutSeconds
     * @returns TgjuMesghalHistoryRecordDto Success
     * @throws ApiError
     */
    public static apiServicesAppPriceGettgjumesghalhistoryGet(
        fromDate?: string,
        toDate?: string,
        limit?: number,
        timeoutSeconds?: number,
    ): CancelablePromise<Array<TgjuMesghalHistoryRecordDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Price/GetTgjuMesghalHistory',
            query: {
                'FromDate': fromDate,
                'ToDate': toDate,
                'Limit': limit,
                'TimeoutSeconds': timeoutSeconds,
            },
        });
    }
    /**
     * @param fromDate
     * @param toDate
     * @param limit
     * @param timeoutSeconds
     * @returns TgjuMesghalSeriesPointDto Success
     * @throws ApiError
     */
    public static apiServicesAppPriceGettgjumesghalseriesGet(
        fromDate?: string,
        toDate?: string,
        limit?: number,
        timeoutSeconds?: number,
    ): CancelablePromise<Array<TgjuMesghalSeriesPointDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Price/GetTgjuMesghalSeries',
            query: {
                'FromDate': fromDate,
                'ToDate': toDate,
                'Limit': limit,
                'TimeoutSeconds': timeoutSeconds,
            },
        });
    }
    /**
     * @param historyFilePath
     * @param fromDate
     * @param toDate
     * @param limit
     * @param timeoutSeconds
     * @returns MesghalSnapshotDto Success
     * @throws ApiError
     */
    public static apiServicesAppPriceGetlocalmesghalhistoryGet(
        historyFilePath?: string,
        fromDate?: string,
        toDate?: string,
        limit?: number,
        timeoutSeconds?: number,
    ): CancelablePromise<Array<MesghalSnapshotDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Price/GetLocalMesghalHistory',
            query: {
                'HistoryFilePath': historyFilePath,
                'FromDate': fromDate,
                'ToDate': toDate,
                'Limit': limit,
                'TimeoutSeconds': timeoutSeconds,
            },
        });
    }
    /**
     * @param historyFilePath
     * @param fromDate
     * @param toDate
     * @param limit
     * @param timeoutSeconds
     * @returns MesghalSeriesPointDto Success
     * @throws ApiError
     */
    public static apiServicesAppPriceGetlocalmesghalseriesGet(
        historyFilePath?: string,
        fromDate?: string,
        toDate?: string,
        limit?: number,
        timeoutSeconds?: number,
    ): CancelablePromise<Array<MesghalSeriesPointDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Price/GetLocalMesghalSeries',
            query: {
                'HistoryFilePath': historyFilePath,
                'FromDate': fromDate,
                'ToDate': toDate,
                'Limit': limit,
                'TimeoutSeconds': timeoutSeconds,
            },
        });
    }
    /**
     * @param fromDate
     * @param toDate
     * @param limit
     * @param timeoutSeconds
     * @returns GlobalGoldRecordDto Success
     * @throws ApiError
     */
    public static apiServicesAppPriceGetglobalgoldhistoryGet(
        fromDate?: string,
        toDate?: string,
        limit?: number,
        timeoutSeconds?: number,
    ): CancelablePromise<Array<GlobalGoldRecordDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Price/GetGlobalGoldHistory',
            query: {
                'FromDate': fromDate,
                'ToDate': toDate,
                'Limit': limit,
                'TimeoutSeconds': timeoutSeconds,
            },
        });
    }
    /**
     * @param symbol
     * @param timeFrame
     * @param fromDate
     * @param toDate
     * @returns DynamicPriceCandlesResponseDto Success
     * @throws ApiError
     */
    public static apiServicesAppPriceGetdynamicpriceGet(
        symbol?: string,
        timeFrame?: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<DynamicPriceCandlesResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Price/GetDynamicPrice',
            query: {
                'Symbol': symbol,
                'TimeFrame': timeFrame,
                'FromDate': fromDate,
                'ToDate': toDate,
            },
        });
    }
}
