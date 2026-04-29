/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrUpdateRoleInput } from '../models/CreateOrUpdateRoleInput';
import type { GetRoleForEditOutput } from '../models/GetRoleForEditOutput';
import type { GetRolesInput } from '../models/GetRolesInput';
import type { ListResultDtoOfRoleListDto } from '../models/ListResultDtoOfRoleListDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoleService {
    /**
     * @param requestBody
     * @returns ListResultDtoOfRoleListDto Success
     * @throws ApiError
     */
    public static apiServicesAppRoleGetrolesPost(
        requestBody?: GetRolesInput,
    ): CancelablePromise<ListResultDtoOfRoleListDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Role/GetRoles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns GetRoleForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppRoleGetroleforeditGet(
        id?: number,
    ): CancelablePromise<GetRoleForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Role/GetRoleForEdit',
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
    public static apiServicesAppRoleCreateorupdaterolePost(
        requestBody?: CreateOrUpdateRoleInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Role/CreateOrUpdateRole',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppRoleDeleteroleDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/Role/DeleteRole',
            query: {
                'Id': id,
            },
        });
    }
}
