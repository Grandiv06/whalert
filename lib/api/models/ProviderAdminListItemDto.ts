/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderType } from './ProviderType';
export type ProviderAdminListItemDto = {
    id?: number;
    userId?: number | null;
    displayName?: string | null;
    name?: string | null;
    surname?: string | null;
    emailAddress?: string | null;
    phoneNumber?: string | null;
    isActive?: boolean;
    totalSignals?: number;
    subscriberCount?: number;
    providerType?: ProviderType;
    creationTime?: string;
};

