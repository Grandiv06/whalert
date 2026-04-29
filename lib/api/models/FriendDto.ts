/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendshipState } from './FriendshipState';
export type FriendDto = {
    friendUserId?: number;
    friendTenantId?: number | null;
    friendUserName?: string | null;
    friendTenancyName?: string | null;
    friendProfilePictureId?: string | null;
    unreadMessageCount?: number;
    isOnline?: boolean;
    state?: FriendshipState;
};

