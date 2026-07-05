/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
import type { SignalOutcomeSource } from './SignalOutcomeSource';
import type { SignalOutcomeStatus } from './SignalOutcomeStatus';
import type { SignalSide } from './SignalSide';
import type { SignalStatus } from './SignalStatus';
export type OfferedPositionsDto = {
    tradingSignalId?: number;
    market?: MarketType;
    displayName?: string | null;
    side?: SignalSide;
    date?: string;
    symbols?: Array<string> | null;
    entryPrice?: number;
    sl?: number;
    tPs?: Array<number> | null;
    pictureUrl?: string | null;
    pictureId?: string | null;
    signalStatus?: SignalStatus;
    statusLabel?: string | null;
    outcomeStatus?: SignalOutcomeStatus;
    outcomeSource?: SignalOutcomeSource;
};

