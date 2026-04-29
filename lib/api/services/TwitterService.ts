/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TwitterGetAccessTokenResponse } from '../models/TwitterGetAccessTokenResponse';
import type { TwitterGetRequestTokenResponse } from '../models/TwitterGetRequestTokenResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TwitterService {
    /**
     * @returns TwitterGetRequestTokenResponse Success
     * @throws ApiError
     */
    public static apiTwitterGetrequesttokenPost(): CancelablePromise<TwitterGetRequestTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Twitter/GetRequestToken',
        });
    }
    /**
     * @param token
     * @param verifier
     * @returns TwitterGetAccessTokenResponse Success
     * @throws ApiError
     */
    public static apiTwitterGetaccesstokenPost(
        token?: string,
        verifier?: string,
    ): CancelablePromise<TwitterGetAccessTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Twitter/GetAccessToken',
            query: {
                'token': token,
                'verifier': verifier,
            },
        });
    }
}
