/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderType } from './ProviderType';
import type { User } from './User';
export type SignalProvider = {
    id?: number;
    creationTime?: string;
    creatorUserId?: number | null;
    lastModificationTime?: string | null;
    lastModifierUserId?: number | null;
    isDeleted?: boolean;
    deleterUserId?: number | null;
    deletionTime?: string | null;
    tenantId?: number | null;
    aiModelName?: string | null;
    displayName?: string | null;
    avatar?: string | null;
    totalSignals?: number;
    activeSignals?: number;
    successRate?: number;
    failureRate?: number;
    rating?: number;
    userId?: number | null;
    userFk?: User;
    providerType?: ProviderType;
    isHidden?: boolean;
};

