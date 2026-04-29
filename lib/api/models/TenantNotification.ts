/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationData } from './NotificationData';
import type { NotificationSeverity } from './NotificationSeverity';
import type { Type } from './Type';
export type TenantNotification = {
    id?: string;
    tenantId?: number | null;
    notificationName?: string | null;
    data?: NotificationData;
    entityType?: Type;
    entityTypeName?: string | null;
    entityId?: any;
    severity?: NotificationSeverity;
    creationTime?: string;
};

