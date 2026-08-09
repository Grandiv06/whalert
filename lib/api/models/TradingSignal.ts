/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Market } from './Market';
import type { SignalOutcomeSource } from './SignalOutcomeSource';
import type { SignalOutcomeStatus } from './SignalOutcomeStatus';
import type { SignalProvider } from './SignalProvider';
import type { SignalSide } from './SignalSide';
import type { SignalStatus } from './SignalStatus';
import type { SignalVisibility } from './SignalVisibility';
export type TradingSignal = {
    id?: number;
    creationTime?: string;
    creatorUserId?: number | null;
    lastModificationTime?: string | null;
    lastModifierUserId?: number | null;
    isDeleted?: boolean;
    deleterUserId?: number | null;
    deletionTime?: string | null;
    tenantId?: number | null;
    side?: SignalSide;
    entryPoint?: number;
    stopLoss?: number;
    leverage?: number;
    riskRewardRatio?: number;
    tradingViewAnalysisUrl?: string | null;
    description?: string | null;
    picture?: string | null;
    pictureUrl?: string | null;
    signalStatus?: SignalStatus;
    activatedAt?: string | null;
    signalVisibility?: SignalVisibility;
    expiresAt?: string;
    outcomeStatus?: SignalOutcomeStatus;
    outcomeSource?: SignalOutcomeSource;
    suggestedOutcomeStatus?: SignalOutcomeStatus;
    suggestedOutcomeDetectedAt?: string | null;
    suggestedEntryReached?: boolean;
    suggestedEntryDetectedAt?: string | null;
    outcomeDeclaredByUserId?: number | null;
    outcomeDeclaredAt?: string | null;
    marketId?: number | null;
    marketFk?: Market;
    signalProviderId?: number | null;
    signalProviderFk?: SignalProvider;
};

