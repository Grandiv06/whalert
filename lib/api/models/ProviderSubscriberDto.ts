/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExecutionType } from './ExecutionType';
export type ProviderSubscriberDto = {
    followId?: number;
    userId?: number;
    name?: string | null;
    surname?: string | null;
    emailAddress?: string | null;
    phoneNumber?: string | null;
    followedAt?: string;
    defaultExecutionType?: ExecutionType;
    allowDemoSignals?: boolean;
    allowRealSignal?: boolean;
    maxRiskPerTradePercent?: number;
    maxDailyLossPercent?: number;
    margin?: number;
};

