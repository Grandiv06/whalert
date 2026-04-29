/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowUnfollowFilter } from './FollowUnfollowFilter';
import type { GetAllSignalProviderInfoFilter } from './GetAllSignalProviderInfoFilter';
import type { ProviderType } from './ProviderType';
export type SignalProviderInfoInput = {
    maxResultCount?: number;
    skipCount?: number;
    sorting?: string | null;
    providerType?: ProviderType;
    filter?: GetAllSignalProviderInfoFilter;
    search?: string | null;
    followUnfollowFilter?: FollowUnfollowFilter;
};

