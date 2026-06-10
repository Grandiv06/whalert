/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Asset } from './Asset';
import type { MarketType } from './MarketType';
export type Market = {
    id?: number;
    creationTime?: string;
    creatorUserId?: number | null;
    lastModificationTime?: string | null;
    lastModifierUserId?: number | null;
    isDeleted?: boolean;
    deleterUserId?: number | null;
    deletionTime?: string | null;
    tenantId?: number | null;
    symbol?: string | null;
    marketType?: MarketType;
    baseAssetId?: number | null;
    baseAssetFk?: Asset;
    quoteAssetId?: number | null;
    quoteAssetFk?: Asset;
};

