/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailSettingsEditDto } from './EmailSettingsEditDto';
import type { ExternalLoginProviderSettingsEditDto } from './ExternalLoginProviderSettingsEditDto';
import type { GeneralSettingsEditDto } from './GeneralSettingsEditDto';
import type { HostBillingSettingsEditDto } from './HostBillingSettingsEditDto';
import type { HostUserManagementSettingsEditDto } from './HostUserManagementSettingsEditDto';
import type { OtherSettingsEditDto } from './OtherSettingsEditDto';
import type { SecuritySettingsEditDto } from './SecuritySettingsEditDto';
import type { TenantManagementSettingsEditDto } from './TenantManagementSettingsEditDto';
export type HostSettingsEditDto = {
    general: GeneralSettingsEditDto;
    userManagement: HostUserManagementSettingsEditDto;
    email: EmailSettingsEditDto;
    tenantManagement: TenantManagementSettingsEditDto;
    security: SecuritySettingsEditDto;
    billing?: HostBillingSettingsEditDto;
    otherSettings?: OtherSettingsEditDto;
    externalLoginProviderSettings?: ExternalLoginProviderSettingsEditDto;
};

