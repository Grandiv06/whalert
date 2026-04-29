/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
export type GetAllSendAttemptsOutput = {
    id?: string;
    webhookEventId?: string;
    webhookName?: string | null;
    data?: string | null;
    response?: string | null;
    responseStatusCode?: HttpStatusCode;
    creationTime?: string;
};

