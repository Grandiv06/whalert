/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingCycle } from './BillingCycle';
import type { SubscriptionFaqItemDto } from './SubscriptionFaqItemDto';
import type { SubscriptionMarketFocus } from './SubscriptionMarketFocus';
import type { SubscriptionPlanFeatureItemDto } from './SubscriptionPlanFeatureItemDto';
import type { SubscriptionTier } from './SubscriptionTier';
export type SubscriptionPlanDetailDto = {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    subtitle?: string | null;
    description?: string | null;
    summaryText?: string | null;
    callToActionText?: string | null;
    highlightTag?: string | null;
    themeColor?: string | null;
    displayOrder?: number;
    isHighlighted?: boolean;
    marketFocus?: SubscriptionMarketFocus;
    tier?: SubscriptionTier;
    billingCycle?: BillingCycle;
    price?: number;
    durationInDays?: number;
    trialDays?: number | null;
    maxDailySignals?: number | null;
    includesAiBots?: boolean;
    includesHumanAnalyst?: boolean;
    supportsAdvancedFilters?: boolean;
    features?: Array<SubscriptionPlanFeatureItemDto> | null;
    faqs?: Array<SubscriptionFaqItemDto> | null;
};

