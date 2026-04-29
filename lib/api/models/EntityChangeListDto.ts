/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityChangeType } from './EntityChangeType';
export type EntityChangeListDto = {
    id?: number;
    userId?: number | null;
    userName?: string | null;
    changeTime?: string;
    entityTypeFullName?: string | null;
    changeType?: EntityChangeType;
    readonly changeTypeName?: string | null;
    entityChangeSetId?: number;
};

