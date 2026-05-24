/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignalOutcomeStatus } from './SignalOutcomeStatus';
import type { SignalSide } from './SignalSide';
export type GetMySignalForEditOutput = {
    tradingSignalId?: number;
    symbol?: string | null;
    side?: SignalSide;
    entryPrice?: number;
    stopLoss?: number;
    takeProfits?: Array<number> | null;
    description?: string | null;
    pictureUrl?: string | null;
    outcomeStatus?: SignalOutcomeStatus;
    isEditable?: boolean;
};

