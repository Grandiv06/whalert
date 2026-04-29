/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EditionInfoDto } from './EditionInfoDto';
import type { NameValueDto } from './NameValueDto';
import type { PaymentPeriodType } from './PaymentPeriodType';
import type { SubscriptionPaymentType } from './SubscriptionPaymentType';
export type TenantLoginInfoDto = {
    id?: number;
    tenancyName?: string | null;
    name?: string | null;
    darkLogoId?: string | null;
    darkLogoFileType?: string | null;
    darkLogoMinimalId?: string | null;
    darkLogoMinimalFileType?: string | null;
    lightLogoId?: string | null;
    lightLogoFileType?: string | null;
    lightLogoMinimalId?: string | null;
    lightLogoMinimalFileType?: string | null;
    customCssId?: string | null;
    subscriptionEndDateUtc?: string | null;
    isInTrialPeriod?: boolean;
    subscriptionPaymentType?: SubscriptionPaymentType;
    edition?: EditionInfoDto;
    featureValues?: Array<NameValueDto> | null;
    creationTime?: string;
    paymentPeriodType?: PaymentPeriodType;
    subscriptionDateString?: string | null;
    creationTimeString?: string | null;
};

