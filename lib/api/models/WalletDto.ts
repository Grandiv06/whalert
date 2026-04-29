/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WalletStatus } from './WalletStatus';
export type WalletDto = {
    id?: number;
    currency?: string | null;
    availableBalance?: number;
    lockedBalance?: number;
    rowVersion?: number;
    walletStatus?: WalletStatus;
    userId?: number | null;
};

