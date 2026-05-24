/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeclareSignalOutcomeInput } from '../models/DeclareSignalOutcomeInput';
import type { GetMySignalForEditInput } from '../models/GetMySignalForEditInput';
import type { GetMySignalForEditOutput } from '../models/GetMySignalForEditOutput';
import type { NewSignalInput } from '../models/NewSignalInput';
import type { PagedResultDtoOfGetProvidedOutPut } from '../models/PagedResultDtoOfGetProvidedOutPut';
import type { UpdateMySignalInput } from '../models/UpdateMySignalInput';
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
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderDeclaresignaloutcomePost(
        requestBody?: DeclareSignalOutcomeInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/DeclareSignalOutcome',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetMySignalForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetmysignalforeditPost(
        requestBody?: GetMySignalForEditInput,
    ): CancelablePromise<GetMySignalForEditOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetMySignalForEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderUpdatemysignalPost(
        requestBody?: UpdateMySignalInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/UpdateMySignal',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
