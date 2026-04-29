/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkToUserInput } from '../models/LinkToUserInput';
import type { ListResultDtoOfLinkedUserDto } from '../models/ListResultDtoOfLinkedUserDto';
import type { PagedResultDtoOfLinkedUserDto } from '../models/PagedResultDtoOfLinkedUserDto';
import type { UnlinkUserInput } from '../models/UnlinkUserInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserLinkService {
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserlinkLinktouserPost(
        requestBody?: LinkToUserInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserLink/LinkToUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param maxResultCount
     * @param skipCount
     * @param sorting
     * @returns PagedResultDtoOfLinkedUserDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserlinkGetlinkedusersGet(
        maxResultCount?: number,
        skipCount?: number,
        sorting?: string,
    ): CancelablePromise<PagedResultDtoOfLinkedUserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserLink/GetLinkedUsers',
            query: {
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
            },
        });
    }
    /**
     * @returns ListResultDtoOfLinkedUserDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserlinkGetrecentlyusedlinkedusersGet(): CancelablePromise<ListResultDtoOfLinkedUserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserLink/GetRecentlyUsedLinkedUsers',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserlinkUnlinkuserPost(
        requestBody?: UnlinkUserInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserLink/UnlinkUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
