/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
