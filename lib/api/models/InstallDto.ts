/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailSettingsEditDto } from './EmailSettingsEditDto';
import type { HostBillingSettingsEditDto } from './HostBillingSettingsEditDto';
export type InstallDto = {
    connectionString: string;
    adminPassword: string;
    webSiteUrl: string;
    serverUrl?: string | null;
    defaultLanguage: string;
    smtpSettings?: EmailSettingsEditDto;
    billInfo?: HostBillingSettingsEditDto;
};

