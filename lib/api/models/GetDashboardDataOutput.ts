/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SalesSummaryData } from './SalesSummaryData';
export type GetDashboardDataOutput = {
    totalProfit?: number;
    newFeedbacks?: number;
    newOrders?: number;
    newUsers?: number;
    salesSummary?: Array<SalesSummaryData> | null;
    totalSales?: number;
    revenue?: number;
    expenses?: number;
    growth?: number;
    transactionPercent?: number;
    newVisitPercent?: number;
    bouncePercent?: number;
    dailySales?: Array<number> | null;
    profitShares?: Array<number> | null;
};

