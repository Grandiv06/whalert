/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppAuthenticateModel } from '../models/AppAuthenticateModel';
import type { AppRegisterModel } from '../models/AppRegisterModel';
import type { AuthenticateModel } from '../models/AuthenticateModel';
import type { AuthenticateResultModel } from '../models/AuthenticateResultModel';
import type { ExternalAuthenticateModel } from '../models/ExternalAuthenticateModel';
import type { ExternalAuthenticateResultModel } from '../models/ExternalAuthenticateResultModel';
import type { ExternalLoginProviderInfoModel } from '../models/ExternalLoginProviderInfoModel';
import type { ImpersonatedAuthenticateResultModel } from '../models/ImpersonatedAuthenticateResultModel';
import type { RefreshTokenResult } from '../models/RefreshTokenResult';
import type { SendTwoFactorAuthCodeModel } from '../models/SendTwoFactorAuthCodeModel';
import type { SwitchedAccountAuthenticateResultModel } from '../models/SwitchedAccountAuthenticateResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TokenAuthService {
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiTokenauthAppregisterPost(
        requestBody?: AppRegisterModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/AppRegister',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiTokenauthAppregistersignalproviderPost(
        requestBody?: AppRegisterModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/AppRegisterSignalProvider',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns AuthenticateResultModel Success
     * @throws ApiError
     */
    public static apiTokenauthAppauthenticatePost(
        requestBody?: AppAuthenticateModel,
    ): CancelablePromise<AuthenticateResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/AppAuthenticate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns AuthenticateResultModel Success
     * @throws ApiError
     */
    public static apiTokenauthAuthenticatePost(
        requestBody?: AuthenticateModel,
    ): CancelablePromise<AuthenticateResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/Authenticate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param refreshToken
     * @returns RefreshTokenResult Success
     * @throws ApiError
     */
    public static apiTokenauthRefreshtokenPost(
        refreshToken?: string,
    ): CancelablePromise<RefreshTokenResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/RefreshToken',
            query: {
                'refreshToken': refreshToken,
            },
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiTokenauthLogoutGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TokenAuth/LogOut',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiTokenauthSendtwofactorauthcodePost(
        requestBody?: SendTwoFactorAuthCodeModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/SendTwoFactorAuthCode',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param impersonationToken
     * @returns ImpersonatedAuthenticateResultModel Success
     * @throws ApiError
     */
    public static apiTokenauthImpersonatedauthenticatePost(
        impersonationToken?: string,
    ): CancelablePromise<ImpersonatedAuthenticateResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/ImpersonatedAuthenticate',
            query: {
                'impersonationToken': impersonationToken,
            },
        });
    }
    /**
     * @param userDelegationId
     * @param impersonationToken
     * @returns ImpersonatedAuthenticateResultModel Success
     * @throws ApiError
     */
    public static apiTokenauthDelegatedimpersonatedauthenticatePost(
        userDelegationId?: number,
        impersonationToken?: string,
    ): CancelablePromise<ImpersonatedAuthenticateResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/DelegatedImpersonatedAuthenticate',
            query: {
                'userDelegationId': userDelegationId,
                'impersonationToken': impersonationToken,
            },
        });
    }
    /**
     * @param switchAccountToken
     * @returns SwitchedAccountAuthenticateResultModel Success
     * @throws ApiError
     */
    public static apiTokenauthLinkedaccountauthenticatePost(
        switchAccountToken?: string,
    ): CancelablePromise<SwitchedAccountAuthenticateResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/LinkedAccountAuthenticate',
            query: {
                'switchAccountToken': switchAccountToken,
            },
        });
    }
    /**
     * @returns ExternalLoginProviderInfoModel Success
     * @throws ApiError
     */
    public static apiTokenauthGetexternalauthenticationprovidersGet(): CancelablePromise<Array<ExternalLoginProviderInfoModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TokenAuth/GetExternalAuthenticationProviders',
        });
    }
    /**
     * @param requestBody
     * @returns ExternalAuthenticateResultModel Success
     * @throws ApiError
     */
    public static apiTokenauthExternalauthenticatePost(
        requestBody?: ExternalAuthenticateModel,
    ): CancelablePromise<ExternalAuthenticateResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TokenAuth/ExternalAuthenticate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param message
     * @param severity
     * @returns any Success
     * @throws ApiError
     */
    public static apiTokenauthTestnotificationGet(
        message: string = '',
        severity: string = 'info',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TokenAuth/TestNotification',
            query: {
                'message': message,
                'severity': severity,
            },
        });
    }
}
