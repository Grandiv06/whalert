/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateTenantInput = {
    tenancyName: string;
    name: string;
    adminEmailAddress: string;
    adminName?: string | null;
    adminSurname?: string | null;
    adminPassword?: string | null;
    connectionString?: string | null;
    shouldChangePasswordOnNextLogin?: boolean;
    sendActivationEmail?: boolean;
    editionId?: number | null;
    isActive?: boolean;
    subscriptionEndDateUtc?: string | null;
    isInTrialPeriod?: boolean;
};

