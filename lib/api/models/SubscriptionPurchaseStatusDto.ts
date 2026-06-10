/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPaymentStatus } from './SubscriptionPaymentStatus';
import type { UserSubscriptionStatus } from './UserSubscriptionStatus';
export type SubscriptionPurchaseStatusDto = {
    paymentId?: number;
    paymentStatus?: SubscriptionPaymentStatus;
    externalPaymentId?: string | null;
    isSubscriptionActivated?: boolean;
    isSubscriptionQueued?: boolean;
    subscriptionStatus?: UserSubscriptionStatus;
    queuedSubscriptionsCount?: number;
    userSubscriptionId?: number | null;
    subscriptionPlanId?: number | null;
    startDateUtc?: string | null;
    endDateUtc?: string | null;
};

