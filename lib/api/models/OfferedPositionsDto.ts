/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
import type { SignalSide } from './SignalSide';
export type OfferedPositionsDto = {
    market?: MarketType;
    displayName?: string | null;
    side?: SignalSide;
    date?: string;
    symbols?: Array<string> | null;
    entryPrice?: number;
    sl?: number;
    tPs?: Array<number> | null;
};

