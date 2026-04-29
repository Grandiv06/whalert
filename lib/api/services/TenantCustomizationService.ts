/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TenantCustomizationService {
    /**
     * @param skin
     * @param tenantId
     * @param extension
     * @returns any Success
     * @throws ApiError
     */
    public static tenantcustomizationGettenantlogoBySkinByTenantidByExtensionGet(
        skin: string,
        tenantId?: number,
        extension: string = 'svg',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/TenantCustomization/GetTenantLogo/{skin}/{tenantId}/{extension}',
            path: {
                'skin': skin,
            },
            query: {
                'tenantId': tenantId,
                'extension': extension,
            },
        });
    }
}
