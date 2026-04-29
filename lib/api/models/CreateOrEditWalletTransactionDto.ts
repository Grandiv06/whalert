/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WalletTransactionStatus } from './WalletTransactionStatus';
export type CreateOrEditWalletTransactionDto = {
    id?: number | null;
    amount?: number;
    feeAmount?: number;
    transactionStatus?: WalletTransactionStatus;
    balanceBefore?: number | null;
    balanceAfter?: number | null;
    refrenceType?: string | null;
    refrenceId?: number | null;
    description?: string | null;
    occuredAt?: string;
    walletId?: number | null;
    userId?: number | null;
};

