/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TenantNotification } from './TenantNotification';
import type { UserNotificationState } from './UserNotificationState';
export type UserNotification = {
    id?: string;
    tenantId?: number | null;
    userId?: number;
    state?: UserNotificationState;
    notification?: TenantNotification;
    targetNotifiers?: string | null;
    readonly targetNotifiersList?: Array<string> | null;
};

