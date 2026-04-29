/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDelegationDto } from '../models/CreateUserDelegationDto';
import type { PagedResultDtoOfUserDelegationDto } from '../models/PagedResultDtoOfUserDelegationDto';
import type { UserDelegationDto } from '../models/UserDelegationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserDelegationService {
    /**
     * @param maxResultCount
     * @param skipCount
     * @param sorting
     * @returns PagedResultDtoOfUserDelegationDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdelegationGetdelegatedusersGet(
        maxResultCount?: number,
        skipCount?: number,
        sorting?: string,
    ): CancelablePromise<PagedResultDtoOfUserDelegationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserDelegation/GetDelegatedUsers',
            query: {
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserdelegationDelegatenewuserPost(
        requestBody?: CreateUserDelegationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDelegation/DelegateNewUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserdelegationRemovedelegationDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/UserDelegation/RemoveDelegation',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @returns UserDelegationDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdelegationGetactiveuserdelegationsGet(): CancelablePromise<Array<UserDelegationDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserDelegation/GetActiveUserDelegations',
        });
    }
}
