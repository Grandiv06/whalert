/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrUpdateUserInput } from '../models/CreateOrUpdateUserInput';
import type { EntityDtoOfInt64 } from '../models/EntityDtoOfInt64';
import type { FileDto } from '../models/FileDto';
import type { GetUserForEditOutput } from '../models/GetUserForEditOutput';
import type { GetUserPermissionsForEditOutput } from '../models/GetUserPermissionsForEditOutput';
import type { GetUsersInput } from '../models/GetUsersInput';
import type { PagedResultDtoOfUserListDto } from '../models/PagedResultDtoOfUserListDto';
import type { UpdateUserPermissionsInput } from '../models/UpdateUserPermissionsInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @param requestBody
     * @returns PagedResultDtoOfUserListDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserGetusersPost(
        requestBody?: GetUsersInput,
    ): CancelablePromise<PagedResultDtoOfUserListDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/User/GetUsers',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param filter
     * @param permissions
     * @param selectedColumns
     * @param role
     * @param onlyLockedUsers
     * @param sorting
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserGetuserstoexcelGet(
        filter?: string,
        permissions?: Array<string>,
        selectedColumns?: Array<string>,
        role?: number,
        onlyLockedUsers?: boolean,
        sorting?: string,
    ): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/User/GetUsersToExcel',
            query: {
                'Filter': filter,
                'Permissions': permissions,
                'SelectedColumns': selectedColumns,
                'Role': role,
                'OnlyLockedUsers': onlyLockedUsers,
                'Sorting': sorting,
            },
        });
    }
    /**
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppUserGetuserexcelcolumnstoexcelGet(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/User/GetUserExcelColumnsToExcel',
        });
    }
    /**
     * @param id
     * @returns GetUserForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserGetuserforeditGet(
        id?: number,
    ): CancelablePromise<GetUserForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/User/GetUserForEdit',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param id
     * @returns GetUserPermissionsForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserGetuserpermissionsforeditGet(
        id?: number,
    ): CancelablePromise<GetUserPermissionsForEditOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/User/GetUserPermissionsForEdit',
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
    public static apiServicesAppUserResetuserspecificpermissionsPost(
        requestBody?: EntityDtoOfInt64,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/User/ResetUserSpecificPermissions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserUpdateuserpermissionsPut(
        requestBody?: UpdateUserPermissionsInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/User/UpdateUserPermissions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserCreateorupdateuserPost(
        requestBody?: CreateOrUpdateUserInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/User/CreateOrUpdateUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserDeleteuserDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/User/DeleteUser',
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
    public static apiServicesAppUserUnlockuserPost(
        requestBody?: EntityDtoOfInt64,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/User/UnlockUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
