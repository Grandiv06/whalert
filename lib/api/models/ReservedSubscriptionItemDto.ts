/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingCycle } from './BillingCycle';
import type { SubscriptionTier } from './SubscriptionTier';
import type { UserSubscriptionStatus } from './UserSubscriptionStatus';
export type ReservedSubscriptionItemDto = {
    subscriptionId?: number;
    status?: UserSubscriptionStatus;
    queuePosition?: number;
    startDateUtc?: string;
    endDateUtc?: string | null;
    remainingDays?: number | null;
    autoRenew?: boolean;
    creationTime?: string;
    subscriptionPlanId?: number;
    planName?: string | null;
    planDisplayName?: string | null;
    price?: number;
    durationInDays?: number;
    tier?: SubscriptionTier;
    billingCycle?: BillingCycle;
};

