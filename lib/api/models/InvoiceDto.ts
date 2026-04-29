/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPaymentProductDto } from './SubscriptionPaymentProductDto';
export type InvoiceDto = {
    items?: Array<SubscriptionPaymentProductDto> | null;
    totalAmount?: number;
    invoiceNo?: string | null;
    invoiceDate?: string;
    tenantLegalName?: string | null;
    tenantAddress?: Array<string> | null;
    tenantTaxNo?: string | null;
    hostLegalName?: string | null;
    hostAddress?: Array<string> | null;
};

