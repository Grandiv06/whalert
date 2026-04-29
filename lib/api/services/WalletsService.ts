/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditWalletDto } from '../models/CreateOrEditWalletDto';
import type { FileDto } from '../models/FileDto';
import type { GetWalletForEditOutput } from '../models/GetWalletForEditOutput';
import type { GetWalletForViewDto } from '../models/GetWalletForViewDto';
import type { PagedResultDtoOfGetWalletForViewDto } from '../models/PagedResultDtoOfGetWalletForViewDto';
import type { PagedResultDtoOfWalletUserLookupTableDto } from '../models/PagedResultDtoOfWalletUserLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WalletsService {
    /**
     * @param filter
     * @param currencyFilter
     * @param maxAvailableBalanceFilter
     * @param minAvailableBalanceFilter
     * @param maxLockedBalanceFilter
     * @param minLockedBalanceFilter
     * @param maxRowVersionFilter
     * @param minRowVersionFilter
     * @param walletStatusFilter
     * @param userNameFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetWalletForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppWalletsGetallGet(
        filter?: string,
        currencyFilter?: string,
        maxAvailableBalanceFilter?: number,
        minAvailableBalanceFilter?: number,
        maxLockedBalanceFilter?: number,
        minLockedBalanceFilter?: number,
        maxRowVersionFilter?: number,
        minRowVersionFilter?: number,
        walletStatusFilter?: number,
        userNameFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetWalletForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Wallets/GetAll',
            query: {
                'Filter': filter,
                'CurrencyFilter': currencyFilter,
                'MaxAvailableBalanceFilter': maxAvailableBalanceFilter,
                'MinAvailableBalanceFilter': minAvailableBalanceFilter,
                'MaxLockedBalanceFilter': maxLockedBalanceFilter,
                'MinLockedBalanceFilter': minLockedBalanceFilter,
                'MaxRowVersionFilter': maxRowVersionFilter,
                'MinRowVersionFilter': minRowVersionFilter,
                'WalletStatusFilter': walletStatusFilter,
                'UserNameFilter': userNameFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetWalletForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppWalletsGetwalletforviewGet(
        id?: number,
    ): CancelablePromise<GetWalletForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Wallets/GetWalletForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetWalletForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppWalletsGetwalletforeditGet(
        id?: number,
    ): CancelablePromise<GetWalletForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Wallets/GetWalletForEdit',
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
    public static apiServicesAppWalletsCreateoreditPost(
        requestBody?: CreateOrEditWalletDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Wallets/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppWalletsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Wallets/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param currencyFilter
     * @param maxAvailableBalanceFilter
     * @param minAvailableBalanceFilter
     * @param maxLockedBalanceFilter
     * @param minLockedBalanceFilter
     * @param maxRowVersionFilter
     * @param minRowVersionFilter
     * @param walletStatusFilter
     * @param userNameFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppWalletsGetwalletstoexcelGet(
        filter?: string,
        currencyFilter?: string,
        maxAvailableBalanceFilter?: number,
        minAvailableBalanceFilter?: number,
        maxLockedBalanceFilter?: number,
        minLockedBalanceFilter?: number,
        maxRowVersionFilter?: number,
        minRowVersionFilter?: number,
        walletStatusFilter?: number,
        userNameFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Wallets/GetWalletsToExcel',
            query: {
                'Filter': filter,
                'CurrencyFilter': currencyFilter,
                'MaxAvailableBalanceFilter': maxAvailableBalanceFilter,
                'MinAvailableBalanceFilter': minAvailableBalanceFilter,
                'MaxLockedBalanceFilter': maxLockedBalanceFilter,
                'MinLockedBalanceFilter': minLockedBalanceFilter,
                'MaxRowVersionFilter': maxRowVersionFilter,
                'MinRowVersionFilter': minRowVersionFilter,
                'WalletStatusFilter': walletStatusFilter,
                'UserNameFilter': userNameFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfWalletUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppWalletsGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfWalletUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Wallets/GetAllUserForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
