/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuthenticateModel = {
    userNameOrEmailAddress: string;
    password: string;
    twoFactorVerificationCode?: string | null;
    rememberClient?: boolean;
    twoFactorRememberClientToken?: string | null;
    singleSignIn?: boolean | null;
    returnUrl?: string | null;
    captchaResponse?: string | null;
};

