/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingCycle } from './BillingCycle';
import type { SubscriptionMarketFocus } from './SubscriptionMarketFocus';
import type { SubscriptionTier } from './SubscriptionTier';
export type SubscriptionPlanAdminListItemDto = {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    subtitle?: string | null;
    description?: string | null;
    summaryText?: string | null;
    callToActionText?: string | null;
    highlightTag?: string | null;
    themeColor?: string | null;
    marketFocus?: SubscriptionMarketFocus;
    tier?: SubscriptionTier;
    billingCycle?: BillingCycle;
    price?: number;
    discountPercent?: number;
    discountPrice?: number | null;
    discountedPrice?: number;
    durationInDays?: number;
    trialDays?: number | null;
    maxDailySignals?: number | null;
    includesAiBots?: boolean;
    includesHumanAnalyst?: boolean;
    supportsAdvancedFilters?: boolean;
    includesLiveSessions?: boolean;
    isActive?: boolean;
    isPurchasable?: boolean;
    isHighlighted?: boolean;
    displayOrder?: number;
};

