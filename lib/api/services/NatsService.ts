/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NatsService {
    /**
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppNatsPingPost(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Nats/Ping',
        });
    }
}
