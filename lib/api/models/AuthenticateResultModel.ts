/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuthenticateResultModel = {
    accessToken?: string | null;
    encryptedAccessToken?: string | null;
    expireInSeconds?: number;
    shouldResetPassword?: boolean;
    passwordResetCode?: string | null;
    userId?: number;
    requiresTwoFactorVerification?: boolean;
    twoFactorAuthProviders?: Array<string> | null;
    twoFactorRememberClientToken?: string | null;
    returnUrl?: string | null;
    refreshToken?: string | null;
    refreshTokenExpireInSeconds?: number;
    'c'?: string | null;
    isFirstLogin?: boolean;
};

