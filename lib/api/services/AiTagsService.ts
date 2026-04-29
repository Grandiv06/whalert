/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditAiTagDto } from '../models/CreateOrEditAiTagDto';
import type { FileDto } from '../models/FileDto';
import type { GetAiTagForEditOutput } from '../models/GetAiTagForEditOutput';
import type { GetAiTagForViewDto } from '../models/GetAiTagForViewDto';
import type { PagedResultDtoOfAiTagSignalProviderLookupTableDto } from '../models/PagedResultDtoOfAiTagSignalProviderLookupTableDto';
import type { PagedResultDtoOfGetAiTagForViewDto } from '../models/PagedResultDtoOfGetAiTagForViewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiTagsService {
    /**
     * @param filter
     * @param titleFilter
     * @param isActiveFilter
     * @param signalProviderAiModelNameFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetAiTagForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppAitagsGetallGet(
        filter?: string,
        titleFilter?: string,
        isActiveFilter?: number,
        signalProviderAiModelNameFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetAiTagForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AiTags/GetAll',
            query: {
                'Filter': filter,
                'TitleFilter': titleFilter,
                'IsActiveFilter': isActiveFilter,
                'SignalProviderAIModelNameFilter': signalProviderAiModelNameFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetAiTagForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppAitagsGetaitagforviewGet(
        id?: number,
    ): CancelablePromise<GetAiTagForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AiTags/GetAiTagForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetAiTagForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAitagsGetaitagforeditGet(
        id?: number,
    ): CancelablePromise<GetAiTagForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AiTags/GetAiTagForEdit',
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
    public static apiServicesAppAitagsCreateoreditPost(
        requestBody?: CreateOrEditAiTagDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AiTags/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAitagsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/AiTags/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param titleFilter
     * @param isActiveFilter
     * @param signalProviderAiModelNameFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppAitagsGetaitagstoexcelGet(
        filter?: string,
        titleFilter?: string,
        isActiveFilter?: number,
        signalProviderAiModelNameFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AiTags/GetAiTagsToExcel',
            query: {
                'Filter': filter,
                'TitleFilter': titleFilter,
                'IsActiveFilter': isActiveFilter,
                'SignalProviderAIModelNameFilter': signalProviderAiModelNameFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfAiTagSignalProviderLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppAitagsGetallsignalproviderforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfAiTagSignalProviderLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/AiTags/GetAllSignalProviderForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
