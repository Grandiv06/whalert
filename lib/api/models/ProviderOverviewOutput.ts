/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderRecentActivityDto } from './ProviderRecentActivityDto';
export type ProviderOverviewOutput = {
    activeSignals?: number;
    totalSignals?: number;
    subscriberCount?: number;
    connectedChannels?: number;
    totalChannels?: number;
    successRate?: number;
    pendingConfirmationCount?: number;
    openForManualNotifyCount?: number;
    recentActivity?: Array<ProviderRecentActivityDto> | null;
};

