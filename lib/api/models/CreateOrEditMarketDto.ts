/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
export type CreateOrEditMarketDto = {
    id?: number | null;
    symbol?: string | null;
    marketType?: MarketType;
    baseAssetId?: number | null;
    quoteAssetId?: number | null;
};

