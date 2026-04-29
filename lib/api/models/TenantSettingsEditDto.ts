/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalLoginProviderSettingsEditDto } from './ExternalLoginProviderSettingsEditDto';
import type { GeneralSettingsEditDto } from './GeneralSettingsEditDto';
import type { LdapSettingsEditDto } from './LdapSettingsEditDto';
import type { SecuritySettingsEditDto } from './SecuritySettingsEditDto';
import type { TenantBillingSettingsEditDto } from './TenantBillingSettingsEditDto';
import type { TenantEmailSettingsEditDto } from './TenantEmailSettingsEditDto';
import type { TenantOtherSettingsEditDto } from './TenantOtherSettingsEditDto';
import type { TenantUserManagementSettingsEditDto } from './TenantUserManagementSettingsEditDto';
export type TenantSettingsEditDto = {
    general?: GeneralSettingsEditDto;
    userManagement: TenantUserManagementSettingsEditDto;
    email?: TenantEmailSettingsEditDto;
    ldap?: LdapSettingsEditDto;
    security: SecuritySettingsEditDto;
    billing?: TenantBillingSettingsEditDto;
    otherSettings?: TenantOtherSettingsEditDto;
    externalLoginProviderSettings?: ExternalLoginProviderSettingsEditDto;
};

