/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetHomepageSignalsOutput } from '../models/GetHomepageSignalsOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HomepageService {
    /**
     * @returns GetHomepageSignalsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppHomepageGetlatestsignalsPost(): CancelablePromise<GetHomepageSignalsOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Homepage/GetLatestSignals',
        });
    }
}
