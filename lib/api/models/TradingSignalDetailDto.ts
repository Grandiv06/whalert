/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
import type { ProviderType } from './ProviderType';
import type { SignalOutcomeSource } from './SignalOutcomeSource';
import type { SignalOutcomeStatus } from './SignalOutcomeStatus';
import type { SignalSide } from './SignalSide';
import type { SignalStatus } from './SignalStatus';
import type { SignalVisibility } from './SignalVisibility';
import type { TradingSignalTargetDetailDto } from './TradingSignalTargetDetailDto';
export type TradingSignalDetailDto = {
    tradingSignalId?: number;
    marketId?: number | null;
    symbol?: string | null;
    market?: MarketType;
    signalProviderId?: number | null;
    providerDisplayName?: string | null;
    providerType?: ProviderType;
    providerRating?: number | null;
    side?: SignalSide;
    entryPrice?: number;
    stopLoss?: number;
    leverage?: number;
    riskRewardRatio?: number;
    description?: string | null;
    pictureUrl?: string | null;
    pictureId?: string | null;
    pictureBase64?: string | null;
    tradingViewAnalysisUrl?: string | null;
    signalStatus?: SignalStatus;
    signalVisibility?: SignalVisibility;
    expiresAt?: string;
    outcomeStatus?: SignalOutcomeStatus;
    outcomeSource?: SignalOutcomeSource;
    suggestedOutcomeStatus?: SignalOutcomeStatus;
    suggestedOutcomeDetectedAt?: string | null;
    outcomeDeclaredByUserId?: number | null;
    outcomeDeclaredAt?: string | null;
    creationTime?: string;
    datePersian?: string | null;
    canDeclareOutcome?: boolean;
    takeProfits?: Array<number> | null;
    targets?: Array<TradingSignalTargetDetailDto> | null;
};

