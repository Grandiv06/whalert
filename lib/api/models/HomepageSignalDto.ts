/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
import type { SignalSide } from './SignalSide';
import type { SignalStatus } from './SignalStatus';
export type HomepageSignalDto = {
    tradingSignalId?: number;
    signalProviderId?: number | null;
    providerDisplayName?: string | null;
    symbol?: string | null;
    market?: MarketType;
    side?: SignalSide;
    signalStatus?: SignalStatus;
    statusLabel?: string | null;
    entryPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    riskRewardRatio?: number;
    riskRewardLabel?: string | null;
    date?: string;
    datePersian?: string | null;
};

