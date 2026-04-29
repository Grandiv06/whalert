/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPaymentStatus } from './SubscriptionPaymentStatus';
export type SubscriptionPurchaseStatusDto = {
    paymentId?: number;
    paymentStatus?: SubscriptionPaymentStatus;
    externalPaymentId?: string | null;
    isSubscriptionActivated?: boolean;
    userSubscriptionId?: number | null;
    subscriptionPlanId?: number | null;
    startDateUtc?: string | null;
    endDateUtc?: string | null;
};

