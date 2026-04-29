/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PasswordComplexitySetting } from './PasswordComplexitySetting';
import type { TwoFactorLoginSettingsEditDto } from './TwoFactorLoginSettingsEditDto';
import type { UserLockOutSettingsEditDto } from './UserLockOutSettingsEditDto';
export type SecuritySettingsEditDto = {
    allowOneConcurrentLoginPerUser?: boolean;
    useDefaultPasswordComplexitySettings?: boolean;
    passwordComplexity?: PasswordComplexitySetting;
    defaultPasswordComplexity?: PasswordComplexitySetting;
    userLockOut?: UserLockOutSettingsEditDto;
    twoFactorLogin?: TwoFactorLoginSettingsEditDto;
};

