/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionTimeOutSettingsEditDto } from './SessionTimeOutSettingsEditDto';
export type TenantUserManagementSettingsEditDto = {
    allowSelfRegistration?: boolean;
    isNewRegisteredUserActiveByDefault?: boolean;
    isEmailConfirmationRequiredForLogin?: boolean;
    useCaptchaOnRegistration?: boolean;
    useCaptchaOnLogin?: boolean;
    isCookieConsentEnabled?: boolean;
    isQuickThemeSelectEnabled?: boolean;
    allowUsingGravatarProfilePicture?: boolean;
    sessionTimeOutSettings?: SessionTimeOutSettingsEditDto;
};

