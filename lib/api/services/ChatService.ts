/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetUserChatFriendsWithSettingsOutput } from '../models/GetUserChatFriendsWithSettingsOutput';
import type { ListResultDtoOfChatMessageDto } from '../models/ListResultDtoOfChatMessageDto';
import type { MarkAllUnreadMessagesOfUserAsReadInput } from '../models/MarkAllUnreadMessagesOfUserAsReadInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * @returns GetUserChatFriendsWithSettingsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppChatGetuserchatfriendswithsettingsGet(): CancelablePromise<GetUserChatFriendsWithSettingsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Chat/GetUserChatFriendsWithSettings',
        });
    }
    /**
     * @param tenantId
     * @param userId
     * @param minMessageId
     * @param maxResultCount
     * @returns ListResultDtoOfChatMessageDto Success
     * @throws ApiError
     */
    public static apiServicesAppChatGetuserchatmessagesGet(
        tenantId?: number,
        userId?: number,
        minMessageId?: number,
        maxResultCount?: number,
    ): CancelablePromise<ListResultDtoOfChatMessageDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Chat/GetUserChatMessages',
            query: {
                'TenantId': tenantId,
                'UserId': userId,
                'MinMessageId': minMessageId,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppChatMarkallunreadmessagesofuserasreadPost(
        requestBody?: MarkAllUnreadMessagesOfUserAsReadInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Chat/MarkAllUnreadMessagesOfUserAsRead',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
