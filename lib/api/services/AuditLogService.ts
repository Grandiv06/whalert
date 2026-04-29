/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityPropertyChangeDto } from '../models/EntityPropertyChangeDto';
import type { FileDto } from '../models/FileDto';
import type { NameValueDto } from '../models/NameValueDto';
import type { PagedResultDtoOfAuditLogListDto } from '../models/PagedResultDtoOfAuditLogListDto';
import type { PagedResultDtoOfEntityChangeListDto } from '../models/PagedResultDtoOfEntityChangeListDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuditLogService {
    /**
     * @param startDate
     * @param endDate
     * @param userName
     * @param serviceName
     * @param methodName
     * @param browserInfo
     * @param hasException
     * @param minExecutionDuration
     * @param maxExecutionDuration
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns PagedResultDtoOfAuditLogListDto Success
     * @throws ApiError
     */
    public static apiServicesAppAuditlogGetauditlogsGet(
        startDate?: string,
        endDate?: string,
        userName?: string,
        serviceName?: string,
        methodName?: string,
        browserInfo?: string,
        hasException?: boolean,
        minExecutionDuration?: number,
        maxExecutionDuration?: number,
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<PagedResultDtoOfAuditLogListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AuditLog/GetAuditLogs',
            query: {
                'StartDate': startDate,
                'EndDate': endDate,
                'UserName': userName,
                'ServiceName': serviceName,
                'MethodName': methodName,
                'BrowserInfo': browserInfo,
                'HasException': hasException,
                'MinExecutionDuration': minExecutionDuration,
                'MaxExecutionDuration': maxExecutionDuration,
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @param startDate
     * @param endDate
     * @param userName
     * @param serviceName
     * @param methodName
     * @param browserInfo
     * @param hasException
     * @param minExecutionDuration
     * @param maxExecutionDuration
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppAuditlogGetauditlogstoexcelGet(
        startDate?: string,
        endDate?: string,
        userName?: string,
        serviceName?: string,
        methodName?: string,
        browserInfo?: string,
        hasException?: boolean,
        minExecutionDuration?: number,
        maxExecutionDuration?: number,
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AuditLog/GetAuditLogsToExcel',
            query: {
                'StartDate': startDate,
                'EndDate': endDate,
                'UserName': userName,
                'ServiceName': serviceName,
                'MethodName': methodName,
                'BrowserInfo': browserInfo,
                'HasException': hasException,
                'MinExecutionDuration': minExecutionDuration,
                'MaxExecutionDuration': maxExecutionDuration,
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @returns NameValueDto Success
     * @throws ApiError
     */
    public static apiServicesAppAuditlogGetentityhistoryobjecttypesGet(): CancelablePromise<Array<NameValueDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AuditLog/GetEntityHistoryObjectTypes',
        });
    }
    /**
     * @param startDate
     * @param endDate
     * @param userName
     * @param entityTypeFullName
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns PagedResultDtoOfEntityChangeListDto Success
     * @throws ApiError
     */
    public static apiServicesAppAuditlogGetentitychangesGet(
        startDate?: string,
        endDate?: string,
        userName?: string,
        entityTypeFullName?: string,
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<PagedResultDtoOfEntityChangeListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AuditLog/GetEntityChanges',
            query: {
                'StartDate': startDate,
                'EndDate': endDate,
                'UserName': userName,
                'EntityTypeFullName': entityTypeFullName,
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @param entityTypeFullName
     * @param entityId
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns PagedResultDtoOfEntityChangeListDto Success
     * @throws ApiError
     */
    public static apiServicesAppAuditlogGetentitytypechangesGet(
        entityTypeFullName?: string,
        entityId?: string,
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<PagedResultDtoOfEntityChangeListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AuditLog/GetEntityTypeChanges',
            query: {
                'EntityTypeFullName': entityTypeFullName,
                'EntityId': entityId,
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @param startDate
     * @param endDate
     * @param userName
     * @param entityTypeFullName
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppAuditlogGetentitychangestoexcelGet(
        startDate?: string,
        endDate?: string,
        userName?: string,
        entityTypeFullName?: string,
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AuditLog/GetEntityChangesToExcel',
            query: {
                'StartDate': startDate,
                'EndDate': endDate,
                'UserName': userName,
                'EntityTypeFullName': entityTypeFullName,
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @param entityChangeId
     * @returns EntityPropertyChangeDto Success
     * @throws ApiError
     */
    public static apiServicesAppAuditlogGetentitypropertychangesGet(
        entityChangeId?: number,
    ): CancelablePromise<Array<EntityPropertyChangeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AuditLog/GetEntityPropertyChanges',
            query: {
                'entityChangeId': entityChangeId,
            },
        });
    }
}
