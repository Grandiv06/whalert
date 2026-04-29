/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrEditReferralDto } from '../models/CreateOrEditReferralDto';
import type { FileDto } from '../models/FileDto';
import type { GetReferralForEditOutput } from '../models/GetReferralForEditOutput';
import type { GetReferralForViewDto } from '../models/GetReferralForViewDto';
import type { PagedResultDtoOfGetReferralForViewDto } from '../models/PagedResultDtoOfGetReferralForViewDto';
import type { PagedResultDtoOfReferralUserLookupTableDto } from '../models/PagedResultDtoOfReferralUserLookupTableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReferralsService {
    /**
     * @param filter
     * @param maxReferredAtFilter
     * @param minReferredAtFilter
     * @param referralCodeFilter
     * @param userNameFilter
     * @param userName2Filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetReferralForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppReferralsGetallGet(
        filter?: string,
        maxReferredAtFilter?: string,
        minReferredAtFilter?: string,
        referralCodeFilter?: string,
        userNameFilter?: string,
        userName2Filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetReferralForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Referrals/GetAll',
            query: {
                'Filter': filter,
                'MaxReferredAtFilter': maxReferredAtFilter,
                'MinReferredAtFilter': minReferredAtFilter,
                'ReferralCodeFilter': referralCodeFilter,
                'UserNameFilter': userNameFilter,
                'UserName2Filter': userName2Filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param id
     * @returns GetReferralForViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppReferralsGetreferralforviewGet(
        id?: number,
    ): CancelablePromise<GetReferralForViewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Referrals/GetReferralForView',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetReferralForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppReferralsGetreferralforeditGet(
        id?: number,
    ): CancelablePromise<GetReferralForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Referrals/GetReferralForEdit',
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
    public static apiServicesAppReferralsCreateoreditPost(
        requestBody?: CreateOrEditReferralDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Referrals/CreateOrEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppReferralsDeleteDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Referrals/Delete',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param filter
     * @param maxReferredAtFilter
     * @param minReferredAtFilter
     * @param referralCodeFilter
     * @param userNameFilter
     * @param userName2Filter
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppReferralsGetreferralstoexcelGet(
        filter?: string,
        maxReferredAtFilter?: string,
        minReferredAtFilter?: string,
        referralCodeFilter?: string,
        userNameFilter?: string,
        userName2Filter?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Referrals/GetReferralsToExcel',
            query: {
                'Filter': filter,
                'MaxReferredAtFilter': maxReferredAtFilter,
                'MinReferredAtFilter': minReferredAtFilter,
                'ReferralCodeFilter': referralCodeFilter,
                'UserNameFilter': userNameFilter,
                'UserName2Filter': userName2Filter,
            },
        });
    }
    /**
     * @param filter
     * @param sorting
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfReferralUserLookupTableDto Success
     * @throws ApiError
     */
    public static apiServicesAppReferralsGetalluserforlookuptableGet(
        filter?: string,
        sorting?: string,
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfReferralUserLookupTableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Referrals/GetAllUserForLookupTable',
            query: {
                'Filter': filter,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
}
