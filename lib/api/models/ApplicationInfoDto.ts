/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApplicationInfoDto = {
    version?: string | null;
    releaseDate?: string;
    currency?: string | null;
    currencySign?: string | null;
    allowTenantsToChangeEmailSettings?: boolean;
    userDelegationIsEnabled?: boolean;
    twoFactorCodeExpireSeconds?: number;
    features?: Record<string, boolean | null> | null;
};

