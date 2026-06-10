/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderType } from './ProviderType';
export type ProviderSettingsOutput = {
    displayName?: string | null;
    apiKeyMasked?: string | null;
    emailAddress?: string | null;
    name?: string | null;
    surname?: string | null;
    phoneNumber?: string | null;
    providerType?: ProviderType;
    totalSignals?: number;
    activeSignals?: number;
    successRate?: number;
    failureRate?: number;
    rating?: number;
    canEditProviderProfile?: boolean;
    canEditPersonalProfile?: boolean;
};

