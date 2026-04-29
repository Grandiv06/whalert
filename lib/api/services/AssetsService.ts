/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditAssetDto } from '../models/CreateOrEditAssetDto';
import type { FileDto } from '../models/FileDto';
import type { GetAssetForEditOutput } from '../models/GetAssetForEditOutput';
import type { GetAssetForViewDto } from '../models/GetAssetForViewDto';
import type { PagedResultDtoOfGetAssetForViewDto } from '../models/PagedResultDtoOfGetAssetForViewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AssetsService {
    /**
     * @param filter
     * @param symbolFilter
     * @param nameFilter
     * @param iconUrlFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetAssetForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppAssetsGetallGet(
        filter?: string,
        symbolFilter?: string,
        nameFilter?: string,
        iconUrlFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetAssetForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Assets/GetAll',
            query: {
                'Filter': filter,
                'SymbolFilter': symbolFilter,
                'NameFilter': nameFilter,
                'IconUrlFilter': iconUrlFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetAssetForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppAssetsGetassetforviewGet(
        id?: number,
    ): CancelablePromise<GetAssetForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Assets/GetAssetForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetAssetForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppAssetsGetassetforeditGet(
        id?: number,
    ): CancelablePromise<GetAssetForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Assets/GetAssetForEdit',
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
    public static apiServicesAppAssetsCreateoreditPost(
        requestBody?: CreateOrEditAssetDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Assets/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppAssetsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Assets/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param symbolFilter
     * @param nameFilter
     * @param iconUrlFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppAssetsGetassetstoexcelGet(
        filter?: string,
        symbolFilter?: string,
        nameFilter?: string,
        iconUrlFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Assets/GetAssetsToExcel',
            query: {
                'Filter': filter,
                'SymbolFilter': symbolFilter,
                'NameFilter': nameFilter,
                'IconUrlFilter': iconUrlFilter,
            },
        });
    }
}
