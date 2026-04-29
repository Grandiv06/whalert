/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentPeriodType } from './PaymentPeriodType';
import type { SubscriptionPaymentGatewayType } from './SubscriptionPaymentGatewayType';
import type { SubscriptionPaymentProductDto } from './SubscriptionPaymentProductDto';
import type { SubscriptionPaymentStatus } from './SubscriptionPaymentStatus';
export type SubscriptionPaymentDto = {
    id?: number;
    gateway?: SubscriptionPaymentGatewayType;
    tenantId?: number;
    dayCount?: number;
    paymentPeriodType?: PaymentPeriodType;
    paymentId?: string | null;
    invoiceNo?: number;
    status?: SubscriptionPaymentStatus;
    isRecurring?: boolean | null;
    isProrationPayment?: boolean;
    externalPaymentId?: string | null;
    successUrl?: string | null;
    errorUrl?: string | null;
    subscriptionPaymentProducts?: Array<SubscriptionPaymentProductDto> | null;
    extraProperties?: Record<string, any> | null;
    totalAmount?: number;
};

