/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FetchDataFromImageFromUrlInputDto } from '../models/FetchDataFromImageFromUrlInputDto';
import type { FetchDataFromImageFromUrlResultDto } from '../models/FetchDataFromImageFromUrlResultDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiServiceService {
    /**
     * @param requestBody
     * @returns FetchDataFromImageFromUrlResultDto Success
     * @throws ApiError
     */
    public static apiServicesAppAiserviceFetchdatafromimagefromurlPost(
        requestBody?: FetchDataFromImageFromUrlInputDto,
    ): CancelablePromise<FetchDataFromImageFromUrlResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/AiService/FetchDataFromImageFromUrl',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
