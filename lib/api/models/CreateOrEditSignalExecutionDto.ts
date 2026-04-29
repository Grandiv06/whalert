/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExecutionStatus } from './ExecutionStatus';
import type { ExecutionType } from './ExecutionType';
import type { ProviderType } from './ProviderType';
export type CreateOrEditSignalExecutionDto = {
    id?: number | null;
    providerType?: ProviderType;
    execType?: ExecutionType;
    entryPrice?: number;
    executionStatus?: ExecutionStatus;
    executedAt?: string;
    marginUsed?: number;
    key?: string | null;
    tradingSignalId?: number | null;
    executedByUserId?: number | null;
};

