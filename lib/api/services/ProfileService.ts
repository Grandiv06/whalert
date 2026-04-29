/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordInput } from '../models/ChangePasswordInput';
import type { ChangeUserLanguageDto } from '../models/ChangeUserLanguageDto';
import type { CurrentUserProfileEditDto } from '../models/CurrentUserProfileEditDto';
import type { GenerateGoogleAuthenticatorKeyOutput } from '../models/GenerateGoogleAuthenticatorKeyOutput';
import type { GetPasswordComplexitySettingOutput } from '../models/GetPasswordComplexitySettingOutput';
import type { GetProfilePictureOutput } from '../models/GetProfilePictureOutput';
import type { SendVerificationSmsInputDto } from '../models/SendVerificationSmsInputDto';
import type { UpdateGoogleAuthenticatorKeyInput } from '../models/UpdateGoogleAuthenticatorKeyInput';
import type { UpdateGoogleAuthenticatorKeyOutput } from '../models/UpdateGoogleAuthenticatorKeyOutput';
import type { UpdateProfilePictureInput } from '../models/UpdateProfilePictureInput';
import type { VerifyAuthenticatorCodeInput } from '../models/VerifyAuthenticatorCodeInput';
import type { VerifySmsCodeInputDto } from '../models/VerifySmsCodeInputDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileService {
    /**
     * @returns CurrentUserProfileEditDto Success
     * @throws ApiError
     */
    public static apiServicesAppProfileGetcurrentuserprofileforeditGet(): CancelablePromise<CurrentUserProfileEditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Profile/GetCurrentUserProfileForEdit',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppProfileDisablegoogleauthenticatorPost(
        requestBody?: VerifyAuthenticatorCodeInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Profile/DisableGoogleAuthenticator',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns UpdateGoogleAuthenticatorKeyOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProfileViewrecoverycodesPost(
        requestBody?: VerifyAuthenticatorCodeInput,
    ): CancelablePromise<UpdateGoogleAuthenticatorKeyOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Profile/ViewRecoveryCodes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns GenerateGoogleAuthenticatorKeyOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProfileGenerategoogleauthenticatorkeyPost(): CancelablePromise<GenerateGoogleAuthenticatorKeyOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Profile/GenerateGoogleAuthenticatorKey',
        });
    }
    /**
     * @param requestBody
     * @returns UpdateGoogleAuthenticatorKeyOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProfileUpdategoogleauthenticatorkeyPut(
        requestBody?: UpdateGoogleAuthenticatorKeyInput,
    ): CancelablePromise<UpdateGoogleAuthenticatorKeyOutput> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Profile/UpdateGoogleAuthenticatorKey',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppProfileSendverificationsmsPost(
        requestBody?: SendVerificationSmsInputDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Profile/SendVerificationSms',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppProfileVerifysmscodePost(
        requestBody?: VerifySmsCodeInputDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Profile/VerifySmsCode',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppProfilePreparecollecteddataPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Profile/PrepareCollectedData',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppProfileUpdatecurrentuserprofilePut(
        requestBody?: CurrentUserProfileEditDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Profile/UpdateCurrentUserProfile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppProfileChangepasswordPost(
        requestBody?: ChangePasswordInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Profile/ChangePassword',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppProfileUpdateprofilepicturePut(
        requestBody?: UpdateProfilePictureInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Profile/UpdateProfilePicture',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppProfileVerifyauthenticatorcodePost(
        requestBody?: VerifyAuthenticatorCodeInput,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Profile/VerifyAuthenticatorCode',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns GetPasswordComplexitySettingOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProfileGetpasswordcomplexitysettingGet(): CancelablePromise<GetPasswordComplexitySettingOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Profile/GetPasswordComplexitySetting',
        });
    }
    /**
     * @returns GetProfilePictureOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProfileGetprofilepictureGet(): CancelablePromise<GetProfilePictureOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Profile/GetProfilePicture',
        });
    }
    /**
     * @param username
     * @returns GetProfilePictureOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProfileGetprofilepicturebyusernameGet(
        username?: string,
    ): CancelablePromise<GetProfilePictureOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Profile/GetProfilePictureByUserName',
            query: {
                'username': username,
            },
        });
    }
    /**
     * @param userId
     * @param tenantId
     * @returns GetProfilePictureOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProfileGetfriendprofilepictureGet(
        userId?: number,
        tenantId?: number,
    ): CancelablePromise<GetProfilePictureOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Profile/GetFriendProfilePicture',
            query: {
                'UserId': userId,
                'TenantId': tenantId,
            },
        });
    }
    /**
     * @param userId
     * @returns GetProfilePictureOutput Success
     * @throws ApiError
     */
    public static apiServicesAppProfileGetprofilepicturebyuserGet(
        userId?: number,
    ): CancelablePromise<GetProfilePictureOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Profile/GetProfilePictureByUser',
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppProfileChangelanguagePost(
        requestBody?: ChangeUserLanguageDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Profile/ChangeLanguage',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppProfileGetorcreatemt5ApitokenGet(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Profile/GetOrCreateMt5ApiToken',
        });
    }
}
