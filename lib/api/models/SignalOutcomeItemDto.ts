/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
import type { SignalOutcomeSource } from './SignalOutcomeSource';
import type { SignalOutcomeStatus } from './SignalOutcomeStatus';
import type { SignalSide } from './SignalSide';
import type { SignalStatus } from './SignalStatus';
export type SignalOutcomeItemDto = {
    tradingSignalId?: number;
    symbol?: string | null;
    market?: MarketType;
    displayName?: string | null;
    side?: SignalSide;
    date?: string;
    datePersian?: string | null;
    entryPrice?: number;
    sl?: number;
    tPs?: Array<number> | null;
    description?: string | null;
    outcomeStatus?: SignalOutcomeStatus;
    outcomeSource?: SignalOutcomeSource;
    suggestedOutcomeStatus?: SignalOutcomeStatus;
    suggestedOutcomeDetectedAt?: string | null;
    outcomeDeclaredAt?: string | null;
    canConfirmDetectedOutcome?: boolean;
    canDeclareOutcome?: boolean;
    signalStatus?: SignalStatus;
    canCancelPending?: boolean;
    pictureUrl?: string | null;
    pictureId?: string | null;
};

