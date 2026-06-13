/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetMonthlyProfitLossChartOutput } from '../models/GetMonthlyProfitLossChartOutput';
import type { GetPerformanceByAssetChartOutput } from '../models/GetPerformanceByAssetChartOutput';
import type { GetRewardToRiskChartOutput } from '../models/GetRewardToRiskChartOutput';
import type { ProviderShowcaseChartInput } from '../models/ProviderShowcaseChartInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProviderShowcaseService {
    /**
     * @param requestBody
     * @returns GetMonthlyProfitLossChartOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProvidershowcaseGetmonthlyprofitlosschartPost(
        requestBody?: ProviderShowcaseChartInput,
    ): CancelablePromise<GetMonthlyProfitLossChartOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/ProviderShowcase/GetMonthlyProfitLossChart',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetRewardToRiskChartOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProvidershowcaseGetrewardtoriskchartPost(
        requestBody?: ProviderShowcaseChartInput,
    ): CancelablePromise<GetRewardToRiskChartOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/ProviderShowcase/GetRewardToRiskChart',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetPerformanceByAssetChartOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProvidershowcaseGetperformancebyassetchartPost(
        requestBody?: ProviderShowcaseChartInput,
    ): CancelablePromise<GetPerformanceByAssetChartOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/ProviderShowcase/GetPerformanceByAssetChart',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
