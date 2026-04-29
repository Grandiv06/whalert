/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePaymentProductDto } from './CreatePaymentProductDto';
import type { PaymentPeriodType } from './PaymentPeriodType';
import type { SubscriptionPaymentGatewayType } from './SubscriptionPaymentGatewayType';
export type CreatePaymentDto = {
    tenantId?: number;
    paymentPeriodType?: PaymentPeriodType;
    subscriptionPaymentGatewayType?: SubscriptionPaymentGatewayType;
    recurringPaymentEnabled?: boolean | null;
    isProrationPayment?: boolean | null;
    successUrl?: string | null;
    errorUrl?: string | null;
    extraProperties?: Record<string, any> | null;
    products?: Array<CreatePaymentProductDto> | null;
};

