/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingCycle } from './BillingCycle';
import type { SubscriptionMarketFocus } from './SubscriptionMarketFocus';
import type { SubscriptionTier } from './SubscriptionTier';
import type { UserSubscriptionStatus } from './UserSubscriptionStatus';
export type UserSubscriptionPlanDetailsDto = {
    hasSubscription?: boolean;
    subscriptionId?: number | null;
    subscriptionStatus?: UserSubscriptionStatus;
    startDateUtc?: string | null;
    endDateUtc?: string | null;
    remainingDays?: number | null;
    autoRenew?: boolean;
    subscriptionPlanId?: number | null;
    planName?: string | null;
    planDisplayName?: string | null;
    subtitle?: string | null;
    description?: string | null;
    summaryText?: string | null;
    callToActionText?: string | null;
    highlightTag?: string | null;
    themeColor?: string | null;
    displayOrder?: number;
    isHighlighted?: boolean;
    marketFocus?: SubscriptionMarketFocus;
    planTier?: SubscriptionTier;
    billingCycle?: BillingCycle;
    price?: number | null;
    durationInDays?: number | null;
    trialDays?: number | null;
    maxDailySignals?: number | null;
};

