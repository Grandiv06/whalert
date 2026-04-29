/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatMessageReadState } from './ChatMessageReadState';
import type { ChatSide } from './ChatSide';
export type ChatMessageDto = {
    id?: number;
    userId?: number;
    tenantId?: number | null;
    targetUserId?: number;
    targetTenantId?: number | null;
    side?: ChatSide;
    readState?: ChatMessageReadState;
    receiverReadState?: ChatMessageReadState;
    message?: string | null;
    creationTime?: string;
    sharedMessageId?: string | null;
};

