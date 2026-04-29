/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WalletStatus } from './WalletStatus';
export type CreateOrEditWalletDto = {
    id?: number | null;
    currency?: string | null;
    availableBalance?: number;
    lockedBalance?: number;
    rowVersion?: number;
    walletStatus?: WalletStatus;
    userId?: number | null;
};

