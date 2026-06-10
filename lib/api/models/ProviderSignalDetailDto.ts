/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
import type { SignalOutcomeSource } from './SignalOutcomeSource';
import type { SignalOutcomeStatus } from './SignalOutcomeStatus';
import type { SignalSide } from './SignalSide';
import type { SignalStatus } from './SignalStatus';
export type ProviderSignalDetailDto = {
    tradingSignalId?: number;
    symbol?: string | null;
    market?: MarketType;
    side?: SignalSide;
    entryPrice?: number;
    stopLoss?: number;
    leverage?: number;
    riskRewardRatio?: number;
    description?: string | null;
    pictureUrl?: string | null;
    pictureBase64?: string | null;
    tradingViewAnalysisUrl?: string | null;
    signalStatus?: SignalStatus;
    outcomeStatus?: SignalOutcomeStatus;
    outcomeSource?: SignalOutcomeSource;
    suggestedOutcomeStatus?: SignalOutcomeStatus;
    suggestedOutcomeDetectedAt?: string | null;
    outcomeDeclaredAt?: string | null;
    creationTime?: string;
    datePersian?: string | null;
    takeProfits?: Array<number> | null;
    canCancelPending?: boolean;
    canConfirmDetectedOutcome?: boolean;
    canDeclareOutcome?: boolean;
};

