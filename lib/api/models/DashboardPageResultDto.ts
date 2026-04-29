/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowedOfferStatusResultDto } from './FollowedOfferStatusResultDto';
import type { ShowPositionsDto } from './ShowPositionsDto';
export type DashboardPageResultDto = {
    status?: FollowedOfferStatusResultDto;
    positions?: Array<ShowPositionsDto> | null;
    totalPositionsCount?: number;
};

