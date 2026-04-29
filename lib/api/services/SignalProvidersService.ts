/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditSignalProviderDto } from '../models/CreateOrEditSignalProviderDto';
import type { FileDto } from '../models/FileDto';
import type { GetSignalProviderForEditOutput } from '../models/GetSignalProviderForEditOutput';
import type { GetSignalProviderForViewDto } from '../models/GetSignalProviderForViewDto';
import type { PagedResultDtoOfGetSignalProviderForViewDto } from '../models/PagedResultDtoOfGetSignalProviderForViewDto';
import type { PagedResultDtoOfSignalProviderUserLookupTableDto } from '../models/PagedResultDtoOfSignalProviderUserLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignalProvidersService {
    /**
     * @param filter
     * @param aiModelNameFilter
     * @param displayNameFilter
     * @param maxTotalSignalsFilter
     * @param minTotalSignalsFilter
     * @param maxActiveSignalsFilter
     * @param minActiveSignalsFilter
     * @param maxSuccessRateFilter
     * @param minSuccessRateFilter
     * @param maxFailureRateFilter
     * @param minFailureRateFilter
     * @param maxRatingFilter
     * @param minRatingFilter
     * @param userNameFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetSignalProviderForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalprovidersGetallGet(
        filter?: string,
        aiModelNameFilter?: string,
        displayNameFilter?: string,
        maxTotalSignalsFilter?: number,
        minTotalSignalsFilter?: number,
        maxActiveSignalsFilter?: number,
        minActiveSignalsFilter?: number,
        maxSuccessRateFilter?: number,
        minSuccessRateFilter?: number,
        maxFailureRateFilter?: number,
        minFailureRateFilter?: number,
        maxRatingFilter?: number,
        minRatingFilter?: number,
        userNameFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetSignalProviderForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalProviders/GetAll',
            query: {
                'Filter': filter,
                'AIModelNameFilter': aiModelNameFilter,
                'DisplayNameFilter': displayNameFilter,
                'MaxTotalSignalsFilter': maxTotalSignalsFilter,
                'MinTotalSignalsFilter': minTotalSignalsFilter,
                'MaxActiveSignalsFilter': maxActiveSignalsFilter,
                'MinActiveSignalsFilter': minActiveSignalsFilter,
                'MaxSuccessRateFilter': maxSuccessRateFilter,
                'MinSuccessRateFilter': minSuccessRateFilter,
                'MaxFailureRateFilter': maxFailureRateFilter,
                'MinFailureRateFilter': minFailureRateFilter,
                'MaxRatingFilter': maxRatingFilter,
                'MinRatingFilter': minRatingFilter,
                'UserNameFilter': userNameFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetSignalProviderForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalprovidersGetsignalproviderforviewGet(
        id?: number,
    ): CancelablePromise<GetSignalProviderForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalProviders/GetSignalProviderForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetSignalProviderForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalprovidersGetsignalproviderforeditGet(
        id?: number,
    ): CancelablePromise<GetSignalProviderForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalProviders/GetSignalProviderForEdit',
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
    public static apiServicesAppSignalprovidersCreateoreditPost(
        requestBody?: CreateOrEditSignalProviderDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProviders/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalprovidersDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/SignalProviders/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param aiModelNameFilter
     * @param displayNameFilter
     * @param maxTotalSignalsFilter
     * @param minTotalSignalsFilter
     * @param maxActiveSignalsFilter
     * @param minActiveSignalsFilter
     * @param maxSuccessRateFilter
     * @param minSuccessRateFilter
     * @param maxFailureRateFilter
     * @param minFailureRateFilter
     * @param maxRatingFilter
     * @param minRatingFilter
     * @param userNameFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalprovidersGetsignalproviderstoexcelGet(
        filter?: string,
        aiModelNameFilter?: string,
        displayNameFilter?: string,
        maxTotalSignalsFilter?: number,
        minTotalSignalsFilter?: number,
        maxActiveSignalsFilter?: number,
        minActiveSignalsFilter?: number,
        maxSuccessRateFilter?: number,
        minSuccessRateFilter?: number,
        maxFailureRateFilter?: number,
        minFailureRateFilter?: number,
        maxRatingFilter?: number,
        minRatingFilter?: number,
        userNameFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalProviders/GetSignalProvidersToExcel',
            query: {
                'Filter': filter,
                'AIModelNameFilter': aiModelNameFilter,
                'DisplayNameFilter': displayNameFilter,
                'MaxTotalSignalsFilter': maxTotalSignalsFilter,
                'MinTotalSignalsFilter': minTotalSignalsFilter,
                'MaxActiveSignalsFilter': maxActiveSignalsFilter,
                'MinActiveSignalsFilter': minActiveSignalsFilter,
                'MaxSuccessRateFilter': maxSuccessRateFilter,
                'MinSuccessRateFilter': minSuccessRateFilter,
                'MaxFailureRateFilter': maxFailureRateFilter,
                'MinFailureRateFilter': minFailureRateFilter,
                'MaxRatingFilter': maxRatingFilter,
                'MinRatingFilter': minRatingFilter,
                'UserNameFilter': userNameFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfSignalProviderUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalprovidersGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfSignalProviderUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalProviders/GetAllUserForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalprovidersRemoveavatarfileDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/SignalProviders/RemoveAvatarFile',
            query: {
                'Id': id,
            },
        });
    }
}
