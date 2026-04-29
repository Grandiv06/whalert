/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExecutionType } from './ExecutionType';
export type UserSignalFollowDto = {
    id?: number;
    followedAt?: string;
    defaultExecutionType?: ExecutionType;
    allowDemoSignals?: boolean;
    allowRealSignal?: boolean;
    maxRiskPerTradePercent?: number;
    maxDailyLossPercent?: number;
    userId?: number | null;
    signalProviderId?: number | null;
};

