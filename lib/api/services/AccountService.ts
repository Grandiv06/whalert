/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivateEmailInput } from '../models/ActivateEmailInput';
import type { ChangeEmailInput } from '../models/ChangeEmailInput';
import type { DelegatedImpersonateInput } from '../models/DelegatedImpersonateInput';
import type { ImpersonateOutput } from '../models/ImpersonateOutput';
import type { ImpersonateTenantInput } from '../models/ImpersonateTenantInput';
import type { ImpersonateUserInput } from '../models/ImpersonateUserInput';
import type { IsTenantAvailableInput } from '../models/IsTenantAvailableInput';
import type { IsTenantAvailableOutput } from '../models/IsTenantAvailableOutput';
import type { RegisterInput } from '../models/RegisterInput';
import type { RegisterOutput } from '../models/RegisterOutput';
import type { ResetPasswordInput } from '../models/ResetPasswordInput';
import type { ResetPasswordOutput } from '../models/ResetPasswordOutput';
import type { ResolveTenantIdInput } from '../models/ResolveTenantIdInput';
import type { SendEmailActivationLinkInput } from '../models/SendEmailActivationLinkInput';
import type { SendPasswordResetCodeInput } from '../models/SendPasswordResetCodeInput';
import type { SwitchToLinkedAccountInput } from '../models/SwitchToLinkedAccountInput';
import type { SwitchToLinkedAccountOutput } from '../models/SwitchToLinkedAccountOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountService {
    /**
     * @param requestBody
     * @returns IsTenantAvailableOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAccountIstenantavailablePost(
        requestBody?: IsTenantAvailableInput,
    ): CancelablePromise<IsTenantAvailableOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/IsTenantAvailable',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns number Success
     * @throws ApiError
     */
    public static apiServicesAppAccountResolvetenantidPost(
        requestBody?: ResolveTenantIdInput,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/ResolveTenantId',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns RegisterOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAccountRegisterPost(
        requestBody?: RegisterInput,
    ): CancelablePromise<RegisterOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/Register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAccountSendpasswordresetcodePost(
        requestBody?: SendPasswordResetCodeInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/SendPasswordResetCode',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ResetPasswordOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAccountResetpasswordPost(
        requestBody?: ResetPasswordInput,
    ): CancelablePromise<ResetPasswordOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/ResetPassword',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAccountSendemailactivationlinkPost(
        requestBody?: SendEmailActivationLinkInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/SendEmailActivationLink',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAccountActivateemailPost(
        requestBody?: ActivateEmailInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/ActivateEmail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAccountChangeemailPost(
        requestBody?: ChangeEmailInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/ChangeEmail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ImpersonateOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAccountImpersonateuserPost(
        requestBody?: ImpersonateUserInput,
    ): CancelablePromise<ImpersonateOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/ImpersonateUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ImpersonateOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAccountImpersonatetenantPost(
        requestBody?: ImpersonateTenantInput,
    ): CancelablePromise<ImpersonateOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/ImpersonateTenant',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ImpersonateOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAccountDelegatedimpersonatePost(
        requestBody?: DelegatedImpersonateInput,
    ): CancelablePromise<ImpersonateOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/DelegatedImpersonate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ImpersonateOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAccountBacktoimpersonatorPost(): CancelablePromise<ImpersonateOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/BackToImpersonator',
        });
    }
    /**
     * @param requestBody
     * @returns SwitchToLinkedAccountOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAccountSwitchtolinkedaccountPost(
        requestBody?: SwitchToLinkedAccountInput,
    ): CancelablePromise<SwitchToLinkedAccountOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Account/SwitchToLinkedAccount',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
