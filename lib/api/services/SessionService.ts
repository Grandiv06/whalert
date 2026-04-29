/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetCurrentLoginInformationsOutput } from '../models/GetCurrentLoginInformationsOutput';
import type { UpdateUserSignInTokenOutput } from '../models/UpdateUserSignInTokenOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SessionService {
    /**
     * @returns GetCurrentLoginInformationsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSessionGetcurrentlogininformationsGet(): CancelablePromise<GetCurrentLoginInformationsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Session/GetCurrentLoginInformations',
        });
    }
    /**
     * @returns UpdateUserSignInTokenOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSessionUpdateusersignintokenPut(): CancelablePromise<UpdateUserSignInTokenOutput> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Session/UpdateUserSignInToken',
        });
    }
}
