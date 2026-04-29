/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditMarketDto } from '../models/CreateOrEditMarketDto';
import type { FileDto } from '../models/FileDto';
import type { GetMarketForEditOutput } from '../models/GetMarketForEditOutput';
import type { GetMarketForViewDto } from '../models/GetMarketForViewDto';
import type { PagedResultDtoOfGetMarketForViewDto } from '../models/PagedResultDtoOfGetMarketForViewDto';
import type { PagedResultDtoOfMarketAssetLookupTableDto } from '../models/PagedResultDtoOfMarketAssetLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MarketsService {
    /**
     * @param filter
     * @param symbolFilter
     * @param marketTypeFilter
     * @param assetNameFilter
     * @param assetName2Filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetMarketForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppMarketsGetallGet(
        filter?: string,
        symbolFilter?: string,
        marketTypeFilter?: number,
        assetNameFilter?: string,
        assetName2Filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetMarketForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Markets/GetAll',
            query: {
                'Filter': filter,
                'SymbolFilter': symbolFilter,
                'MarketTypeFilter': marketTypeFilter,
                'AssetNameFilter': assetNameFilter,
                'AssetName2Filter': assetName2Filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetMarketForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppMarketsGetmarketforviewGet(
        id?: number,
    ): CancelablePromise<GetMarketForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Markets/GetMarketForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetMarketForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppMarketsGetmarketforeditGet(
        id?: number,
    ): CancelablePromise<GetMarketForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Markets/GetMarketForEdit',
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
    public static apiServicesAppMarketsCreateoreditPost(
        requestBody?: CreateOrEditMarketDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Markets/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppMarketsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Markets/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param symbolFilter
     * @param marketTypeFilter
     * @param assetNameFilter
     * @param assetName2Filter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppMarketsGetmarketstoexcelGet(
        filter?: string,
        symbolFilter?: string,
        marketTypeFilter?: number,
        assetNameFilter?: string,
        assetName2Filter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Markets/GetMarketsToExcel',
            query: {
                'Filter': filter,
                'SymbolFilter': symbolFilter,
                'MarketTypeFilter': marketTypeFilter,
                'AssetNameFilter': assetNameFilter,
                'AssetName2Filter': assetName2Filter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfMarketAssetLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppMarketsGetallassetforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfMarketAssetLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Markets/GetAllAssetForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
