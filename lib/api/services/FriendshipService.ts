/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcceptFriendshipRequestInput } from '../models/AcceptFriendshipRequestInput';
import type { BlockUserInput } from '../models/BlockUserInput';
import type { CreateFriendshipForCurrentTenantInput } from '../models/CreateFriendshipForCurrentTenantInput';
import type { CreateFriendshipRequestInput } from '../models/CreateFriendshipRequestInput';
import type { CreateFriendshipWithDifferentTenantInput } from '../models/CreateFriendshipWithDifferentTenantInput';
import type { FriendDto } from '../models/FriendDto';
import type { UnblockUserInput } from '../models/UnblockUserInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FriendshipService {
    /**
     * @param requestBody
     * @returns FriendDto Success
     * @throws ApiError
     */
    public static apiServicesAppFriendshipCreatefriendshiprequestPost(
        requestBody?: CreateFriendshipRequestInput,
    ): CancelablePromise<FriendDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Friendship/CreateFriendshipRequest',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns FriendDto Success
     * @throws ApiError
     */
    public static apiServicesAppFriendshipCreatefriendshipwithdifferenttenantPost(
        requestBody?: CreateFriendshipWithDifferentTenantInput,
    ): CancelablePromise<FriendDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Friendship/CreateFriendshipWithDifferentTenant',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns FriendDto Success
     * @throws ApiError
     */
    public static apiServicesAppFriendshipCreatefriendshipforcurrenttenantPost(
        requestBody?: CreateFriendshipForCurrentTenantInput,
    ): CancelablePromise<FriendDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Friendship/CreateFriendshipForCurrentTenant',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppFriendshipBlockuserPost(
        requestBody?: BlockUserInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Friendship/BlockUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppFriendshipUnblockuserPost(
        requestBody?: UnblockUserInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Friendship/UnblockUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppFriendshipAcceptfriendshiprequestPost(
        requestBody?: AcceptFriendshipRequestInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Friendship/AcceptFriendshipRequest',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param userId
     * @param tenantId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppFriendshipRemovefriendDelete(
        userId?: number,
        tenantId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Friendship/RemoveFriend',
            query: {
                'UserId': userId,
                'TenantId': tenantId,
            },
        });
    }
}
