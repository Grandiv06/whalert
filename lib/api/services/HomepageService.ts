/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetHomepageSignalsInput } from '../models/GetHomepageSignalsInput';
import type { GetHomepageSignalsOutput } from '../models/GetHomepageSignalsOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HomepageService {
    /**
     * @param requestBody
     * @returns GetHomepageSignalsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppHomepageGetlatestsignalsPost(
        requestBody?: GetHomepageSignalsInput,
    ): CancelablePromise<GetHomepageSignalsOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Homepage/GetLatestSignals',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
