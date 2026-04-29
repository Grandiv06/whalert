/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditUserFavoriteMarketDto } from '../models/CreateOrEditUserFavoriteMarketDto';
import type { FileDto } from '../models/FileDto';
import type { GetUserFavoriteMarketForEditOutput } from '../models/GetUserFavoriteMarketForEditOutput';
import type { GetUserFavoriteMarketForViewDto } from '../models/GetUserFavoriteMarketForViewDto';
import type { PagedResultDtoOfGetUserFavoriteMarketForViewDto } from '../models/PagedResultDtoOfGetUserFavoriteMarketForViewDto';
import type { PagedResultDtoOfUserFavoriteMarketMarketLookupTableDto } from '../models/PagedResultDtoOfUserFavoriteMarketMarketLookupTableDto';
import type { PagedResultDtoOfUserFavoriteMarketUserLookupTableDto } from '../models/PagedResultDtoOfUserFavoriteMarketUserLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserFavoriteMarketsService {
    /**
     * @param filter
     * @param userNameFilter
     * @param marketSymbolFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetUserFavoriteMarketForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserfavoritemarketsGetallGet(
        filter?: string,
        userNameFilter?: string,
        marketSymbolFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetUserFavoriteMarketForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserFavoriteMarkets/GetAll',
            query: {
                'Filter': filter,
                'UserNameFilter': userNameFilter,
                'MarketSymbolFilter': marketSymbolFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetUserFavoriteMarketForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserfavoritemarketsGetuserfavoritemarketforviewGet(
        id?: number,
    ): CancelablePromise<GetUserFavoriteMarketForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserFavoriteMarkets/GetUserFavoriteMarketForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetUserFavoriteMarketForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserfavoritemarketsGetuserfavoritemarketforeditGet(
        id?: number,
    ): CancelablePromise<GetUserFavoriteMarketForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserFavoriteMarkets/GetUserFavoriteMarketForEdit',
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
    public static apiServicesAppUserfavoritemarketsCreateoreditPost(
        requestBody?: CreateOrEditUserFavoriteMarketDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserFavoriteMarkets/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserfavoritemarketsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/UserFavoriteMarkets/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param userNameFilter
     * @param marketSymbolFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserfavoritemarketsGetuserfavoritemarketstoexcelGet(
        filter?: string,
        userNameFilter?: string,
        marketSymbolFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserFavoriteMarkets/GetUserFavoriteMarketsToExcel',
            query: {
                'Filter': filter,
                'UserNameFilter': userNameFilter,
                'MarketSymbolFilter': marketSymbolFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfUserFavoriteMarketUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserfavoritemarketsGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfUserFavoriteMarketUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserFavoriteMarkets/GetAllUserForLookupTable',
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
     * @returns PagedResultDtoOfUserFavoriteMarketMarketLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserfavoritemarketsGetallmarketforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfUserFavoriteMarketMarketLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserFavoriteMarkets/GetAllMarketForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
