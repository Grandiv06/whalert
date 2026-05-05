/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoldPriceCandleDto } from '../models/GoldPriceCandleDto';
import type { GoldPriceSeries } from '../models/GoldPriceSeries';
import type { GoldPriceSnapshotDto } from '../models/GoldPriceSnapshotDto';
import type { UpdateGoldPriceInputDto } from '../models/UpdateGoldPriceInputDto';
import type { UpdateGoldPriceResultDto } from '../models/UpdateGoldPriceResultDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GoldPriceService {
    /**
     * @param requestBody
     * @returns UpdateGoldPriceResultDto Success
     * @throws ApiError
     */
    public static apiServicesAppGoldpriceUpdategoldpricePost(
        requestBody?: UpdateGoldPriceInputDto,
    ): CancelablePromise<UpdateGoldPriceResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/GoldPrice/UpdateGoldPrice',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param series
     * @param intervalMinutes
     * @param fromUtc
     * @param toUtc
     * @param tenantId
     * @returns GoldPriceCandleDto Success
     * @throws ApiError
     */
    public static apiServicesAppGoldpriceGetgoldpricecandlesGet(
        series: GoldPriceSeries,
        intervalMinutes?: number,
        fromUtc?: string,
        toUtc?: string,
        tenantId?: number,
    ): CancelablePromise<Array<GoldPriceCandleDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/GoldPrice/GetGoldPriceCandles',
            query: {
                'Series': series,
                'IntervalMinutes': intervalMinutes,
                'FromUtc': fromUtc,
                'ToUtc': toUtc,
                'TenantId': tenantId,
            },
        });
    }
    /**
     * @returns GoldPriceSnapshotDto Success
     * @throws ApiError
     */
    public static apiServicesAppGoldpriceGetlatestgoldpriceGet(): CancelablePromise<GoldPriceSnapshotDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/GoldPrice/GetLatestGoldPrice',
        });
    }
}
