/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
import type { SignalOutcomeSource } from './SignalOutcomeSource';
import type { SignalOutcomeStatus } from './SignalOutcomeStatus';
import type { SignalSide } from './SignalSide';
import type { SignalStatus } from './SignalStatus';
export type GetProvidedOutPut = {
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
    canConfirmDetectedOutcome?: boolean;
    canDeclareOutcome?: boolean;
    outcomeStatus?: SignalOutcomeStatus;
    outcomeSource?: SignalOutcomeSource;
    suggestedOutcomeStatus?: SignalOutcomeStatus;
    suggestedOutcomeDetectedAt?: string | null;
    outcomeDeclaredAt?: string | null;
    signalStatus?: SignalStatus;
    canCancelPending?: boolean;
    pictureUrl?: string | null;
    pictureId?: string | null;
};

