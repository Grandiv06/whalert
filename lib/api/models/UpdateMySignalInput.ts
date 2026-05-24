/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignalSide } from './SignalSide';
export type UpdateMySignalInput = {
    tradingSignalId?: number;
    side?: SignalSide;
    entryPrice?: number;
    stopLoss?: number;
    takeProfits?: Array<number> | null;
    description?: string | null;
    pictureUrl?: string | null;
};

