/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditWalletTransactionDto } from '../models/CreateOrEditWalletTransactionDto';
import type { FileDto } from '../models/FileDto';
import type { GetWalletTransactionForEditOutput } from '../models/GetWalletTransactionForEditOutput';
import type { GetWalletTransactionForViewDto } from '../models/GetWalletTransactionForViewDto';
import type { PagedResultDtoOfGetWalletTransactionForViewDto } from '../models/PagedResultDtoOfGetWalletTransactionForViewDto';
import type { PagedResultDtoOfWalletTransactionUserLookupTableDto } from '../models/PagedResultDtoOfWalletTransactionUserLookupTableDto';
import type { PagedResultDtoOfWalletTransactionWalletLookupTableDto } from '../models/PagedResultDtoOfWalletTransactionWalletLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WalletTransactionsService {
    /**
     * @param filter
     * @param maxAmountFilter
     * @param minAmountFilter
     * @param maxFeeAmountFilter
     * @param minFeeAmountFilter
     * @param transactionStatusFilter
     * @param maxBalanceBeforeFilter
     * @param minBalanceBeforeFilter
     * @param maxBalanceAfterFilter
     * @param minBalanceAfterFilter
     * @param refrenceTypeFilter
     * @param maxRefrenceIdFilter
     * @param minRefrenceIdFilter
     * @param descriptionFilter
     * @param maxOccuredAtFilter
     * @param minOccuredAtFilter
     * @param walletCurrencyFilter
     * @param userNameFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetWalletTransactionForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppWallettransactionsGetallGet(
        filter?: string,
        maxAmountFilter?: number,
        minAmountFilter?: number,
        maxFeeAmountFilter?: number,
        minFeeAmountFilter?: number,
        transactionStatusFilter?: number,
        maxBalanceBeforeFilter?: number,
        minBalanceBeforeFilter?: number,
        maxBalanceAfterFilter?: number,
        minBalanceAfterFilter?: number,
        refrenceTypeFilter?: string,
        maxRefrenceIdFilter?: number,
        minRefrenceIdFilter?: number,
        descriptionFilter?: string,
        maxOccuredAtFilter?: string,
        minOccuredAtFilter?: string,
        walletCurrencyFilter?: string,
        userNameFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetWalletTransactionForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WalletTransactions/GetAll',
            query: {
                'Filter': filter,
                'MaxAmountFilter': maxAmountFilter,
                'MinAmountFilter': minAmountFilter,
                'MaxFeeAmountFilter': maxFeeAmountFilter,
                'MinFeeAmountFilter': minFeeAmountFilter,
                'TransactionStatusFilter': transactionStatusFilter,
                'MaxBalanceBeforeFilter': maxBalanceBeforeFilter,
                'MinBalanceBeforeFilter': minBalanceBeforeFilter,
                'MaxBalanceAfterFilter': maxBalanceAfterFilter,
                'MinBalanceAfterFilter': minBalanceAfterFilter,
                'RefrenceTypeFilter': refrenceTypeFilter,
                'MaxRefrenceIdFilter': maxRefrenceIdFilter,
                'MinRefrenceIdFilter': minRefrenceIdFilter,
                'DescriptionFilter': descriptionFilter,
                'MaxOccuredAtFilter': maxOccuredAtFilter,
                'MinOccuredAtFilter': minOccuredAtFilter,
                'WalletCurrencyFilter': walletCurrencyFilter,
                'UserNameFilter': userNameFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetWalletTransactionForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppWallettransactionsGetwallettransactionforviewGet(
        id?: number,
    ): CancelablePromise<GetWalletTransactionForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WalletTransactions/GetWalletTransactionForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetWalletTransactionForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppWallettransactionsGetwallettransactionforeditGet(
        id?: number,
    ): CancelablePromise<GetWalletTransactionForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WalletTransactions/GetWalletTransactionForEdit',
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
    public static apiServicesAppWallettransactionsCreateoreditPost(
        requestBody?: CreateOrEditWalletTransactionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/WalletTransactions/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppWallettransactionsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/WalletTransactions/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param maxAmountFilter
     * @param minAmountFilter
     * @param maxFeeAmountFilter
     * @param minFeeAmountFilter
     * @param transactionStatusFilter
     * @param maxBalanceBeforeFilter
     * @param minBalanceBeforeFilter
     * @param maxBalanceAfterFilter
     * @param minBalanceAfterFilter
     * @param refrenceTypeFilter
     * @param maxRefrenceIdFilter
     * @param minRefrenceIdFilter
     * @param descriptionFilter
     * @param maxOccuredAtFilter
     * @param minOccuredAtFilter
     * @param walletCurrencyFilter
     * @param userNameFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppWallettransactionsGetwallettransactionstoexcelGet(
        filter?: string,
        maxAmountFilter?: number,
        minAmountFilter?: number,
        maxFeeAmountFilter?: number,
        minFeeAmountFilter?: number,
        transactionStatusFilter?: number,
        maxBalanceBeforeFilter?: number,
        minBalanceBeforeFilter?: number,
        maxBalanceAfterFilter?: number,
        minBalanceAfterFilter?: number,
        refrenceTypeFilter?: string,
        maxRefrenceIdFilter?: number,
        minRefrenceIdFilter?: number,
        descriptionFilter?: string,
        maxOccuredAtFilter?: string,
        minOccuredAtFilter?: string,
        walletCurrencyFilter?: string,
        userNameFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WalletTransactions/GetWalletTransactionsToExcel',
            query: {
                'Filter': filter,
                'MaxAmountFilter': maxAmountFilter,
                'MinAmountFilter': minAmountFilter,
                'MaxFeeAmountFilter': maxFeeAmountFilter,
                'MinFeeAmountFilter': minFeeAmountFilter,
                'TransactionStatusFilter': transactionStatusFilter,
                'MaxBalanceBeforeFilter': maxBalanceBeforeFilter,
                'MinBalanceBeforeFilter': minBalanceBeforeFilter,
                'MaxBalanceAfterFilter': maxBalanceAfterFilter,
                'MinBalanceAfterFilter': minBalanceAfterFilter,
                'RefrenceTypeFilter': refrenceTypeFilter,
                'MaxRefrenceIdFilter': maxRefrenceIdFilter,
                'MinRefrenceIdFilter': minRefrenceIdFilter,
                'DescriptionFilter': descriptionFilter,
                'MaxOccuredAtFilter': maxOccuredAtFilter,
                'MinOccuredAtFilter': minOccuredAtFilter,
                'WalletCurrencyFilter': walletCurrencyFilter,
                'UserNameFilter': userNameFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfWalletTransactionWalletLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppWallettransactionsGetallwalletforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfWalletTransactionWalletLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WalletTransactions/GetAllWalletForLookupTable',
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
     * @returns PagedResultDtoOfWalletTransactionUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppWallettransactionsGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfWalletTransactionUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WalletTransactions/GetAllUserForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
