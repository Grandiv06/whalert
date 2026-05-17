/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
import type { SignalOutcomeSource } from './SignalOutcomeSource';
import type { SignalOutcomeStatus } from './SignalOutcomeStatus';
import type { SignalSide } from './SignalSide';
export type GetProvidedOutPut = {
    symbol?: string | null;
    market?: MarketType;
    displayName?: string | null;
    side?: SignalSide;
    date?: string;
    datePersian?: string | null;
    entryPrice?: number;
    sl?: number;
    tPs?: Array<number> | null;
    outcomeStatus?: SignalOutcomeStatus;
    outcomeSource?: SignalOutcomeSource;
    outcomeDeclaredAt?: string | null;
};

