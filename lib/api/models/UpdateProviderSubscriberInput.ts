/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExecutionType } from './ExecutionType';
export type UpdateProviderSubscriberInput = {
    followId?: number;
    allowDemoSignals?: boolean;
    allowRealSignal?: boolean;
    maxRiskPerTradePercent?: number;
    maxDailyLossPercent?: number;
    margin?: number;
    defaultExecutionType?: ExecutionType;
};

