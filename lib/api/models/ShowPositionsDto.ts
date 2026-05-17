/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketType } from './MarketType';
import type { SignalSide } from './SignalSide';
export type ShowPositionsDto = {
    symbol?: string | null;
    market?: MarketType;
    displayName?: string | null;
    description?: string | null;
    side?: SignalSide;
    date?: string;
    datePersian?: string | null;
    entryPrice?: number;
    sl?: number;
    tPs?: Array<number> | null;
};

