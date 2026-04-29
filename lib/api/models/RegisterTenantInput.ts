/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentPeriodType } from './PaymentPeriodType';
import type { SubscriptionStartType } from './SubscriptionStartType';
export type RegisterTenantInput = {
    tenancyName: string;
    name: string;
    adminEmailAddress: string;
    adminName?: string | null;
    adminSurname?: string | null;
    adminPassword?: string | null;
    captchaResponse?: string | null;
    subscriptionStartType?: SubscriptionStartType;
    paymentPeriodType?: PaymentPeriodType;
    editionId?: number | null;
    successUrl?: string | null;
    errorUrl?: string | null;
};

