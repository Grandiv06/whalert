/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WebhookSubscription = {
    id?: string;
    tenantId?: number | null;
    webhookUri?: string | null;
    secret?: string | null;
    isActive?: boolean;
    webhooks?: Array<string> | null;
    headers?: Record<string, string> | null;
};

