/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrUpdateLanguageInput } from '../models/CreateOrUpdateLanguageInput';
import type { GetLanguageForEditOutput } from '../models/GetLanguageForEditOutput';
import type { GetLanguagesOutput } from '../models/GetLanguagesOutput';
import type { PagedResultDtoOfLanguageTextListDto } from '../models/PagedResultDtoOfLanguageTextListDto';
import type { SetDefaultLanguageInput } from '../models/SetDefaultLanguageInput';
import type { UpdateLanguageTextInput } from '../models/UpdateLanguageTextInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LanguageService {
    /**
     * @returns GetLanguagesOutput Success
     * @throws ApiError
     */
    public static apiServicesAppLanguageGetlanguagesGet(): CancelablePromise<GetLanguagesOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Language/GetLanguages',
        });
    }
    /**
     * @param id
     * @returns GetLanguageForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppLanguageGetlanguageforeditGet(
        id?: number,
    ): CancelablePromise<GetLanguageForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Language/GetLanguageForEdit',
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
    public static apiServicesAppLanguageCreateorupdatelanguagePost(
        requestBody?: CreateOrUpdateLanguageInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Language/CreateOrUpdateLanguage',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppLanguageDeletelanguageDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Language/DeleteLanguage',
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
    public static apiServicesAppLanguageSetdefaultlanguagePost(
        requestBody?: SetDefaultLanguageInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Language/SetDefaultLanguage',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param sourceName
     * @param targetLanguageName
     * @param maxResultCount
     * @param skipCount
     * @param sorting
     * @param baseLanguageName
     * @param targetValueFilter
     * @param filterText
     * @returns PagedResultDtoOfLanguageTextListDto Success
     * @throws ApiError
     */
    public static apiServicesAppLanguageGetlanguagetextsGet(
        sourceName: string,
        targetLanguageName: string,
        maxResultCount?: number,
        skipCount?: number,
        sorting?: string,
        baseLanguageName?: string,
        targetValueFilter?: string,
        filterText?: string,
    ): CancelablePromise<PagedResultDtoOfLanguageTextListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Language/GetLanguageTexts',
            query: {
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
                'SourceName': sourceName,
                'BaseLanguageName': baseLanguageName,
                'TargetLanguageName': targetLanguageName,
                'TargetValueFilter': targetValueFilter,
                'FilterText': filterText,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppLanguageUpdatelanguagetextPut(
        requestBody?: UpdateLanguageTextInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Language/UpdateLanguageText',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
