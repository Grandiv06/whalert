/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChartDateInterval } from '../models/ChartDateInterval';
import type { GetEditionTenantStatisticsOutput } from '../models/GetEditionTenantStatisticsOutput';
import type { GetExpiringTenantsOutput } from '../models/GetExpiringTenantsOutput';
import type { GetIncomeStatisticsDataOutput } from '../models/GetIncomeStatisticsDataOutput';
import type { GetRecentTenantsOutput } from '../models/GetRecentTenantsOutput';
import type { TopStatsData } from '../models/TopStatsData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HostDashboardService {
    /**
     * @param startDate
     * @param endDate
     * @returns TopStatsData Success
     * @throws ApiError
     */
    public static apiServicesAppHostdashboardGettopstatsdataGet(
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<TopStatsData> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/HostDashboard/GetTopStatsData',
            query: {
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }
    /**
     * @returns GetRecentTenantsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppHostdashboardGetrecenttenantsdataGet(): CancelablePromise<GetRecentTenantsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/HostDashboard/GetRecentTenantsData',
        });
    }
    /**
     * @returns GetExpiringTenantsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppHostdashboardGetsubscriptionexpiringtenantsdataGet(): CancelablePromise<GetExpiringTenantsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/HostDashboard/GetSubscriptionExpiringTenantsData',
        });
    }
    /**
     * @param incomeStatisticsDateInterval
     * @param startDate
     * @param endDate
     * @returns GetIncomeStatisticsDataOutput Success
     * @throws ApiError
     */
    public static apiServicesAppHostdashboardGetincomestatisticsGet(
        incomeStatisticsDateInterval?: ChartDateInterval,
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<GetIncomeStatisticsDataOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/HostDashboard/GetIncomeStatistics',
            query: {
                'IncomeStatisticsDateInterval': incomeStatisticsDateInterval,
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }
    /**
     * @param startDate
     * @param endDate
     * @returns GetEditionTenantStatisticsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppHostdashboardGeteditiontenantstatisticsGet(
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<GetEditionTenantStatisticsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/HostDashboard/GetEditionTenantStatistics',
            query: {
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }
}
