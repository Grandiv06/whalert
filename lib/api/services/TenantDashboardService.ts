/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetDailySalesOutput } from '../models/GetDailySalesOutput';
import type { GetDashboardDataOutput } from '../models/GetDashboardDataOutput';
import type { GetGeneralStatsOutput } from '../models/GetGeneralStatsOutput';
import type { GetMemberActivityOutput } from '../models/GetMemberActivityOutput';
import type { GetProfitShareOutput } from '../models/GetProfitShareOutput';
import type { GetRegionalStatsOutput } from '../models/GetRegionalStatsOutput';
import type { GetSalesSummaryOutput } from '../models/GetSalesSummaryOutput';
import type { GetTopStatsOutput } from '../models/GetTopStatsOutput';
import type { SalesSummaryDatePeriod } from '../models/SalesSummaryDatePeriod';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TenantDashboardService {
    /**
     * @returns GetMemberActivityOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantdashboardGetmemberactivityGet(): CancelablePromise<GetMemberActivityOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantDashboard/GetMemberActivity',
        });
    }
    /**
     * @param salesSummaryDatePeriod
     * @returns GetDashboardDataOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantdashboardGetdashboarddataGet(
        salesSummaryDatePeriod?: SalesSummaryDatePeriod,
    ): CancelablePromise<GetDashboardDataOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantDashboard/GetDashboardData',
            query: {
                'SalesSummaryDatePeriod': salesSummaryDatePeriod,
            },
        });
    }
    /**
     * @returns GetTopStatsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantdashboardGettopstatsGet(): CancelablePromise<GetTopStatsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantDashboard/GetTopStats',
        });
    }
    /**
     * @returns GetProfitShareOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantdashboardGetprofitshareGet(): CancelablePromise<GetProfitShareOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantDashboard/GetProfitShare',
        });
    }
    /**
     * @returns GetDailySalesOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantdashboardGetdailysalesGet(): CancelablePromise<GetDailySalesOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantDashboard/GetDailySales',
        });
    }
    /**
     * @param salesSummaryDatePeriod
     * @returns GetSalesSummaryOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantdashboardGetsalessummaryGet(
        salesSummaryDatePeriod?: SalesSummaryDatePeriod,
    ): CancelablePromise<GetSalesSummaryOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantDashboard/GetSalesSummary',
            query: {
                'SalesSummaryDatePeriod': salesSummaryDatePeriod,
            },
        });
    }
    /**
     * @returns GetRegionalStatsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantdashboardGetregionalstatsGet(): CancelablePromise<GetRegionalStatsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantDashboard/GetRegionalStats',
        });
    }
    /**
     * @returns GetGeneralStatsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppTenantdashboardGetgeneralstatsGet(): CancelablePromise<GetGeneralStatsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/TenantDashboard/GetGeneralStats',
        });
    }
}
