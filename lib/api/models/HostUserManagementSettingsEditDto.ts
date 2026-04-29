/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionTimeOutSettingsEditDto } from './SessionTimeOutSettingsEditDto';
import type { UserPasswordSettingsEditDto } from './UserPasswordSettingsEditDto';
export type HostUserManagementSettingsEditDto = {
    isEmailConfirmationRequiredForLogin?: boolean;
    smsVerificationEnabled?: boolean;
    isCookieConsentEnabled?: boolean;
    isQuickThemeSelectEnabled?: boolean;
    useCaptchaOnLogin?: boolean;
    allowUsingGravatarProfilePicture?: boolean;
    sessionTimeOutSettings?: SessionTimeOutSettingsEditDto;
    userPasswordSettings?: UserPasswordSettingsEditDto;
};

