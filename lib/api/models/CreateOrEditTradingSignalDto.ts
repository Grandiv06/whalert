/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignalSide } from './SignalSide';
import type { SignalStatus } from './SignalStatus';
import type { SignalVisibility } from './SignalVisibility';
export type CreateOrEditTradingSignalDto = {
    id?: number | null;
    side?: SignalSide;
    entryPoint?: number;
    stopLoss?: number;
    leverage?: number;
    riskRewardRatio?: number;
    tradingViewAnalysisUrl?: string | null;
    picture?: string | null;
    pictureToken?: string | null;
    pictureUrl?: string | null;
    signalStatus?: SignalStatus;
    signalVisibility?: SignalVisibility;
    expiresAt?: string;
    marketId?: number | null;
    signalProviderId?: number | null;
};

