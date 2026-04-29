/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
export type GetAllSendAttemptsOfWebhookEventOutput = {
    id?: string;
    webhookUri?: string | null;
    webhookSubscriptionId?: string;
    response?: string | null;
    responseStatusCode?: HttpStatusCode;
    creationTime?: string;
    lastModificationTime?: string | null;
};

