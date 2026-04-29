/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditReferralTransactionDto } from '../models/CreateOrEditReferralTransactionDto';
import type { FileDto } from '../models/FileDto';
import type { GetReferralTransactionForEditOutput } from '../models/GetReferralTransactionForEditOutput';
import type { GetReferralTransactionForViewDto } from '../models/GetReferralTransactionForViewDto';
import type { PagedResultDtoOfGetReferralTransactionForViewDto } from '../models/PagedResultDtoOfGetReferralTransactionForViewDto';
import type { PagedResultDtoOfReferralTransactionMarketLookupTableDto } from '../models/PagedResultDtoOfReferralTransactionMarketLookupTableDto';
import type { PagedResultDtoOfReferralTransactionReferralLookupTableDto } from '../models/PagedResultDtoOfReferralTransactionReferralLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReferralTransactionsService {
    /**
     * @param filter
     * @param maxRewardAmountFilter
     * @param minRewardAmountFilter
     * @param maxRewardPercentageFilter
     * @param minRewardPercentageFilter
     * @param marketSymbolFilter
     * @param referralReferralCodeFilter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetReferralTransactionForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppReferraltransactionsGetallGet(
        filter?: string,
        maxRewardAmountFilter?: number,
        minRewardAmountFilter?: number,
        maxRewardPercentageFilter?: number,
        minRewardPercentageFilter?: number,
        marketSymbolFilter?: string,
        referralReferralCodeFilter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetReferralTransactionForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/ReferralTransactions/GetAll',
            query: {
                'Filter': filter,
                'MaxRewardAmountFilter': maxRewardAmountFilter,
                'MinRewardAmountFilter': minRewardAmountFilter,
                'MaxRewardPercentageFilter': maxRewardPercentageFilter,
                'MinRewardPercentageFilter': minRewardPercentageFilter,
                'MarketSymbolFilter': marketSymbolFilter,
                'ReferralReferralCodeFilter': referralReferralCodeFilter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetReferralTransactionForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppReferraltransactionsGetreferraltransactionforviewGet(
        id?: number,
    ): CancelablePromise<GetReferralTransactionForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/ReferralTransactions/GetReferralTransactionForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetReferralTransactionForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppReferraltransactionsGetreferraltransactionforeditGet(
        id?: number,
    ): CancelablePromise<GetReferralTransactionForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/ReferralTransactions/GetReferralTransactionForEdit',
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
    public static apiServicesAppReferraltransactionsCreateoreditPost(
        requestBody?: CreateOrEditReferralTransactionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/ReferralTransactions/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppReferraltransactionsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/ReferralTransactions/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param maxRewardAmountFilter
     * @param minRewardAmountFilter
     * @param maxRewardPercentageFilter
     * @param minRewardPercentageFilter
     * @param marketSymbolFilter
     * @param referralReferralCodeFilter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppReferraltransactionsGetreferraltransactionstoexcelGet(
        filter?: string,
        maxRewardAmountFilter?: number,
        minRewardAmountFilter?: number,
        maxRewardPercentageFilter?: number,
        minRewardPercentageFilter?: number,
        marketSymbolFilter?: string,
        referralReferralCodeFilter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/ReferralTransactions/GetReferralTransactionsToExcel',
            query: {
                'Filter': filter,
                'MaxRewardAmountFilter': maxRewardAmountFilter,
                'MinRewardAmountFilter': minRewardAmountFilter,
                'MaxRewardPercentageFilter': maxRewardPercentageFilter,
                'MinRewardPercentageFilter': minRewardPercentageFilter,
                'MarketSymbolFilter': marketSymbolFilter,
                'ReferralReferralCodeFilter': referralReferralCodeFilter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfReferralTransactionMarketLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppReferraltransactionsGetallmarketforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfReferralTransactionMarketLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/ReferralTransactions/GetAllMarketForLookupTable',
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
     * @returns PagedResultDtoOfReferralTransactionReferralLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppReferraltransactionsGetallreferralforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfReferralTransactionReferralLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/ReferralTransactions/GetAllReferralForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
