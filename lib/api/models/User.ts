/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Setting } from './Setting';
import type { UserClaim } from './UserClaim';
import type { UserLogin } from './UserLogin';
import type { UserOrganizationUnit } from './UserOrganizationUnit';
import type { UserPermissionSetting } from './UserPermissionSetting';
import type { UserRole } from './UserRole';
import type { UserToken } from './UserToken';
export type User = {
    id?: number;
    creationTime?: string;
    creatorUserId?: number | null;
    lastModificationTime?: string | null;
    lastModifierUserId?: number | null;
    isDeleted?: boolean;
    deleterUserId?: number | null;
    deletionTime?: string | null;
    authenticationSource?: string | null;
    userName: string;
    tenantId?: number | null;
    emailAddress: string;
    name: string;
    surname: string;
    readonly fullName?: string | null;
    password: string;
    emailConfirmationCode?: string | null;
    passwordResetCode?: string | null;
    lockoutEndDateUtc?: string | null;
    accessFailedCount?: number;
    isLockoutEnabled?: boolean;
    phoneNumber?: string | null;
    isPhoneNumberConfirmed?: boolean;
    securityStamp?: string | null;
    isTwoFactorEnabled?: boolean;
    logins?: Array<UserLogin> | null;
    roles?: Array<UserRole> | null;
    claims?: Array<UserClaim> | null;
    permissions?: Array<UserPermissionSetting> | null;
    settings?: Array<Setting> | null;
    isEmailConfirmed?: boolean;
    isActive?: boolean;
    normalizedUserName: string;
    normalizedEmailAddress: string;
    concurrencyStamp?: string | null;
    tokens?: Array<UserToken> | null;
    deleterUser?: User;
    creatorUser?: User;
    lastModifierUser?: User;
    profilePictureId?: string | null;
    shouldChangePasswordOnNextLogin?: boolean;
    signInTokenExpireTimeUtc?: string | null;
    signInToken?: string | null;
    googleAuthenticatorKey?: string | null;
    telegramId?: string | null;
    referalCode?: string | null;
    recoveryCode?: string | null;
    mt5ApiToken?: string | null;
    organizationUnits?: Array<UserOrganizationUnit> | null;
};

