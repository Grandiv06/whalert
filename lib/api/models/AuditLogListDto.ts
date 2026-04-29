/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuditLogListDto = {
    id?: number;
    userId?: number | null;
    userName?: string | null;
    impersonatorTenantId?: number | null;
    impersonatorUserId?: number | null;
    serviceName?: string | null;
    methodName?: string | null;
    parameters?: string | null;
    executionTime?: string;
    executionDuration?: number;
    clientIpAddress?: string | null;
    clientName?: string | null;
    browserInfo?: string | null;
    exception?: string | null;
    customData?: string | null;
};

