/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationInfoDto } from './ApplicationInfoDto';
import type { TenantLoginInfoDto } from './TenantLoginInfoDto';
import type { UiCustomizationSettingsDto } from './UiCustomizationSettingsDto';
import type { UserLoginInfoDto } from './UserLoginInfoDto';
export type GetCurrentLoginInformationsOutput = {
    user?: UserLoginInfoDto;
    impersonatorUser?: UserLoginInfoDto;
    tenant?: TenantLoginInfoDto;
    impersonatorTenant?: TenantLoginInfoDto;
    application?: ApplicationInfoDto;
    theme?: UiCustomizationSettingsDto;
};

