/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowedOfferStatusTimeFilter } from './FollowedOfferStatusTimeFilter';
import type { MarketType } from './MarketType';
import type { SignalStatus } from './SignalStatus';
import type { Status } from './Status';
export type OfferedPosiotionsInput = {
    maxResultCount?: number;
    skipCount?: number;
    sorting?: string | null;
    symbol?: string | null;
    marketType?: MarketType;
    searchFilter?: string | null;
    followed?: boolean;
    signalStatus?: SignalStatus;
    timeFilter?: FollowedOfferStatusTimeFilter;
    status?: Status;
};

