/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CentrifugoTokenDto } from '../models/CentrifugoTokenDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CentrifugoTokenGeneratorService {
    /**
     * @param userId
     * @param tenantId
     * @returns CentrifugoTokenDto Success
     * @throws ApiError
     */
    public static apiServicesAppCentrifugotokengeneratorGeneratePost(
        userId?: number,
        tenantId?: number,
    ): CancelablePromise<CentrifugoTokenDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/CentrifugoTokenGenerator/Generate',
            query: {
                'userId': userId,
                'tenantId': tenantId,
            },
        });
    }
}
