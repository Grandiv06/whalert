/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationSeverity } from './NotificationSeverity';
export type CreateMassNotificationInput = {
    message?: string | null;
    severity?: NotificationSeverity;
    userIds?: Array<number> | null;
    organizationUnitIds?: Array<number> | null;
    targetNotifiers?: Array<string> | null;
};

