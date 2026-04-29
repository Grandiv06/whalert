/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NewSignalInput } from '../models/NewSignalInput';
import type { PagedResultDtoOfGetProvidedOutPut } from '../models/PagedResultDtoOfGetProvidedOutPut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignalProviderService {
    /**
     * @param skipCount
     * @param maxResultCount
     * @returns PagedResultDtoOfGetProvidedOutPut Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetprovidedpositionsGet(
        skipCount?: number,
        maxResultCount?: number,
    ): CancelablePromise<PagedResultDtoOfGetProvidedOutPut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/SignalProvider/GetProvidedPositions',
            query: {
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderAddnewsignalPost(
        requestBody?: NewSignalInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/AddNewSignal',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
