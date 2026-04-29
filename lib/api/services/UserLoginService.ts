/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AbpLoginResultType } from '../models/AbpLoginResultType';
import type { PagedResultDtoOfUserLoginAttemptDto } from '../models/PagedResultDtoOfUserLoginAttemptDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserLoginService {
    /**
     * @param filter
     * @param startDate
     * @param endDate
     * @param result
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns PagedResultDtoOfUserLoginAttemptDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserloginGetuserloginattemptsGet(
        filter?: string,
        startDate?: string,
        endDate?: string,
        result?: AbpLoginResultType,
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<PagedResultDtoOfUserLoginAttemptDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserLogin/GetUserLoginAttempts',
            query: {
                'Filter': filter,
                'StartDate': startDate,
                'EndDate': endDate,
                'Result': result,
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
}
