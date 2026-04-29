/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEditionDto } from '../models/CreateEditionDto';
import type { GetEditionEditOutput } from '../models/GetEditionEditOutput';
import type { ListResultDtoOfEditionListDto } from '../models/ListResultDtoOfEditionListDto';
import type { MoveTenantsToAnotherEditionDto } from '../models/MoveTenantsToAnotherEditionDto';
import type { SubscribableEditionComboboxItemDto } from '../models/SubscribableEditionComboboxItemDto';
import type { UpdateEditionDto } from '../models/UpdateEditionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EditionService {
    /**
     * @returns ListResultDtoOfEditionListDto Success
     * @throws ApiError
     */
    public static apiServicesAppEditionGeteditionsGet(): CancelablePromise<ListResultDtoOfEditionListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Edition/GetEditions',
        });
    }
    /**
     * @param id
     * @returns GetEditionEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppEditionGeteditionforeditGet(
        id?: number,
    ): CancelablePromise<GetEditionEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Edition/GetEditionForEdit',
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
    public static apiServicesAppEditionCreateeditionPost(
        requestBody?: CreateEditionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Edition/CreateEdition',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppEditionUpdateeditionPut(
        requestBody?: UpdateEditionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/Edition/UpdateEdition',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppEditionDeleteeditionDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Edition/DeleteEdition',
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
    public static apiServicesAppEditionMovetenantstoanothereditionPost(
        requestBody?: MoveTenantsToAnotherEditionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Edition/MoveTenantsToAnotherEdition',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param selectedEditionId
     * @param addAllItem
     * @param onlyFreeItems
     * @returns SubscribableEditionComboboxItemDto Success
     * @throws ApiError
     */
    public static apiServicesAppEditionGeteditioncomboboxitemsGet(
        selectedEditionId?: number,
        addAllItem: boolean = false,
        onlyFreeItems: boolean = false,
    ): CancelablePromise<Array<SubscribableEditionComboboxItemDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Edition/GetEditionComboboxItems',
            query: {
                'selectedEditionId': selectedEditionId,
                'addAllItem': addAllItem,
                'onlyFreeItems': onlyFreeItems,
            },
        });
    }
    /**
     * @param editionId
     * @returns number Success
     * @throws ApiError
     */
    public static apiServicesAppEditionGettenantcountGet(
        editionId?: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Edition/GetTenantCount',
            query: {
                'editionId': editionId,
            },
        });
    }
}
