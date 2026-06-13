/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignalOutcomeSource } from './SignalOutcomeSource';
import type { SignalOutcomeStatus } from './SignalOutcomeStatus';
import type { SignalSide } from './SignalSide';
import type { SignalStatus } from './SignalStatus';
import type { SignalVisibility } from './SignalVisibility';
export type TradingSignalDto = {
    id?: number;
    side?: SignalSide;
    entryPoint?: number;
    stopLoss?: number;
    leverage?: number;
    riskRewardRatio?: number;
    tradingViewAnalysisUrl?: string | null;
    picture?: string | null;
    pictureFileName?: string | null;
    pictureUrl?: string | null;
    signalStatus?: SignalStatus;
    signalVisibility?: SignalVisibility;
    expiresAt?: string;
    outcomeStatus?: SignalOutcomeStatus;
    outcomeSource?: SignalOutcomeSource;
    outcomeDeclaredByUserId?: number | null;
    outcomeDeclaredAt?: string | null;
    marketId?: number | null;
    signalProviderId?: number | null;
};

