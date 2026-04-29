/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowedOfferStatusTimeFilter } from './FollowedOfferStatusTimeFilter';
import type { SignalStatus } from './SignalStatus';
export type DashboardPageInputDto = {
    maxResultCount?: number;
    skipCount?: number;
    sorting?: string | null;
    timeFilter?: FollowedOfferStatusTimeFilter;
    fromDate?: string | null;
    toDate?: string | null;
    status?: SignalStatus;
};

