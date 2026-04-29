/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditDailyPerformanceSnapshotDto } from '../models/CreateOrEditDailyPerformanceSnapshotDto';
import type { FileDto } from '../models/FileDto';
import type { GetDailyPerformanceSnapshotForEditOutput } from '../models/GetDailyPerformanceSnapshotForEditOutput';
import type { GetDailyPerformanceSnapshotForViewDto } from '../models/GetDailyPerformanceSnapshotForViewDto';
import type { PagedResultDtoOfDailyPerformanceSnapshotSignalProviderLookupTableDto } from '../models/PagedResultDtoOfDailyPerformanceSnapshotSignalProviderLookupTableDto';
import type { PagedResultDtoOfDailyPerformanceSnapshotUserLookupTableDto } from '../models/PagedResultDtoOfDailyPerformanceSnapshotUserLookupTableDto';
import type { PagedResultDtoOfGetDailyPerformanceSnapshotForViewDto } from '../models/PagedResultDtoOfGetDailyPerformanceSnapshotForViewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DailyPerformanceSnapshotsService {
    /**
     * @param filter
     * @param maxDateFilter
     * @param minDateFilter
     * @param maxTotalPnLFilter
     * @param minTotalPnLFilter
     * @param maxWinCountFilter
     * @param minWinCountFilter
     * @param maxLossCountFilter
     * @param minLossCountFilter
     * @param userNameFilter
     * @param signalProviderAiModelNameFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetDailyPerformanceSnapshotForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppDailyperformancesnapshotsGetallGet(
        filter?: string,
        maxDateFilter?: string,
        minDateFilter?: string,
        maxTotalPnLFilter?: number,
        minTotalPnLFilter?: number,
        maxWinCountFilter?: number,
        minWinCountFilter?: number,
        maxLossCountFilter?: number,
        minLossCountFilter?: number,
        userNameFilter?: string,
        signalProviderAiModelNameFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetDailyPerformanceSnapshotForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DailyPerformanceSnapshots/GetAll',
            query: {
                'Filter': filter,
                'MaxDateFilter': maxDateFilter,
                'MinDateFilter': minDateFilter,
                'MaxTotalPnLFilter': maxTotalPnLFilter,
                'MinTotalPnLFilter': minTotalPnLFilter,
                'MaxWinCountFilter': maxWinCountFilter,
                'MinWinCountFilter': minWinCountFilter,
                'MaxLossCountFilter': maxLossCountFilter,
                'MinLossCountFilter': minLossCountFilter,
                'UserNameFilter': userNameFilter,
                'SignalProviderAIModelNameFilter': signalProviderAiModelNameFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetDailyPerformanceSnapshotForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppDailyperformancesnapshotsGetdailyperformancesnapshotforviewGet(
        id?: number,
    ): CancelablePromise<GetDailyPerformanceSnapshotForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DailyPerformanceSnapshots/GetDailyPerformanceSnapshotForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetDailyPerformanceSnapshotForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDailyperformancesnapshotsGetdailyperformancesnapshotforeditGet(
        id?: number,
    ): CancelablePromise<GetDailyPerformanceSnapshotForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DailyPerformanceSnapshots/GetDailyPerformanceSnapshotForEdit',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDailyperformancesnapshotsCreateoreditPost(
        requestBody?: CreateOrEditDailyPerformanceSnapshotDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DailyPerformanceSnapshots/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDailyperformancesnapshotsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/DailyPerformanceSnapshots/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param maxDateFilter
     * @param minDateFilter
     * @param maxTotalPnLFilter
     * @param minTotalPnLFilter
     * @param maxWinCountFilter
     * @param minWinCountFilter
     * @param maxLossCountFilter
     * @param minLossCountFilter
     * @param userNameFilter
     * @param signalProviderAiModelNameFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppDailyperformancesnapshotsGetdailyperformancesnapshotstoexcelGet(
        filter?: string,
        maxDateFilter?: string,
        minDateFilter?: string,
        maxTotalPnLFilter?: number,
        minTotalPnLFilter?: number,
        maxWinCountFilter?: number,
        minWinCountFilter?: number,
        maxLossCountFilter?: number,
        minLossCountFilter?: number,
        userNameFilter?: string,
        signalProviderAiModelNameFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DailyPerformanceSnapshots/GetDailyPerformanceSnapshotsToExcel',
            query: {
                'Filter': filter,
                'MaxDateFilter': maxDateFilter,
                'MinDateFilter': minDateFilter,
                'MaxTotalPnLFilter': maxTotalPnLFilter,
                'MinTotalPnLFilter': minTotalPnLFilter,
                'MaxWinCountFilter': maxWinCountFilter,
                'MinWinCountFilter': minWinCountFilter,
                'MaxLossCountFilter': maxLossCountFilter,
                'MinLossCountFilter': minLossCountFilter,
                'UserNameFilter': userNameFilter,
                'SignalProviderAIModelNameFilter': signalProviderAiModelNameFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfDailyPerformanceSnapshotUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppDailyperformancesnapshotsGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfDailyPerformanceSnapshotUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DailyPerformanceSnapshots/GetAllUserForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfDailyPerformanceSnapshotSignalProviderLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppDailyperformancesnapshotsGetallsignalproviderforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfDailyPerformanceSnapshotSignalProviderLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DailyPerformanceSnapshots/GetAllSignalProviderForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
