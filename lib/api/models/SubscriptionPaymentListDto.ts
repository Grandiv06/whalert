/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPaymentProductDto } from './SubscriptionPaymentProductDto';
export type SubscriptionPaymentListDto = {
    id?: number;
    creationTime?: string;
    creatorUserId?: number | null;
    lastModificationTime?: string | null;
    lastModifierUserId?: number | null;
    gateway?: string | null;
    dayCount?: number;
    paymentPeriodType?: string | null;
    externalPaymentId?: string | null;
    payerId?: string | null;
    status?: string | null;
    tenantId?: number;
    invoiceNo?: string | null;
    readonly totalAmount?: number;
    subscriptionPaymentProducts?: Array<SubscriptionPaymentProductDto> | null;
};

