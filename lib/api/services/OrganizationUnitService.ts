/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrganizationUnitInput } from '../models/CreateOrganizationUnitInput';
import type { FindOrganizationUnitRolesInput } from '../models/FindOrganizationUnitRolesInput';
import type { FindOrganizationUnitUsersInput } from '../models/FindOrganizationUnitUsersInput';
import type { ListResultDtoOfOrganizationUnitDto } from '../models/ListResultDtoOfOrganizationUnitDto';
import type { MoveOrganizationUnitInput } from '../models/MoveOrganizationUnitInput';
import type { OrganizationUnitDto } from '../models/OrganizationUnitDto';
import type { PagedResultDtoOfFindOrganizationUnitUsersOutputDto } from '../models/PagedResultDtoOfFindOrganizationUnitUsersOutputDto';
import type { PagedResultDtoOfNameValueDto } from '../models/PagedResultDtoOfNameValueDto';
import type { PagedResultDtoOfOrganizationUnitRoleListDto } from '../models/PagedResultDtoOfOrganizationUnitRoleListDto';
import type { PagedResultDtoOfOrganizationUnitUserListDto } from '../models/PagedResultDtoOfOrganizationUnitUserListDto';
import type { RolesToOrganizationUnitInput } from '../models/RolesToOrganizationUnitInput';
import type { UpdateOrganizationUnitInput } from '../models/UpdateOrganizationUnitInput';
import type { UsersToOrganizationUnitInput } from '../models/UsersToOrganizationUnitInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrganizationUnitService {
    /**
     * @returns ListResultDtoOfOrganizationUnitDto Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitGetorganizationunitsGet(): CancelablePromise<ListResultDtoOfOrganizationUnitDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/OrganizationUnit/GetOrganizationUnits',
        });
    }
    /**
     * @param id
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns PagedResultDtoOfOrganizationUnitUserListDto Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitGetorganizationunitusersGet(
        id?: number,
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<PagedResultDtoOfOrganizationUnitUserListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/OrganizationUnit/GetOrganizationUnitUsers',
            query: {
                'Id': id,
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @param id
     * @param sorting
     * @param maxResultCount
     * @param skipCount
     * @returns PagedResultDtoOfOrganizationUnitRoleListDto Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitGetorganizationunitrolesGet(
        id?: number,
        sorting?: string,
        maxResultCount?: number,
        skipCount?: number,
    ): CancelablePromise<PagedResultDtoOfOrganizationUnitRoleListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/OrganizationUnit/GetOrganizationUnitRoles',
            query: {
                'Id': id,
                'Sorting': sorting,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
            },
        });
    }
    /**
     * @param requestBody
     * @returns OrganizationUnitDto Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitCreateorganizationunitPost(
        requestBody?: CreateOrganizationUnitInput,
    ): CancelablePromise<OrganizationUnitDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/OrganizationUnit/CreateOrganizationUnit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns OrganizationUnitDto Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitUpdateorganizationunitPut(
        requestBody?: UpdateOrganizationUnitInput,
    ): CancelablePromise<OrganizationUnitDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/OrganizationUnit/UpdateOrganizationUnit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns OrganizationUnitDto Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitMoveorganizationunitPost(
        requestBody?: MoveOrganizationUnitInput,
    ): CancelablePromise<OrganizationUnitDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/OrganizationUnit/MoveOrganizationUnit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitDeleteorganizationunitDelete(
        id?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/OrganizationUnit/DeleteOrganizationUnit',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param userId
     * @param organizationUnitId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitRemoveuserfromorganizationunitDelete(
        userId?: number,
        organizationUnitId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/OrganizationUnit/RemoveUserFromOrganizationUnit',
            query: {
                'UserId': userId,
                'OrganizationUnitId': organizationUnitId,
            },
        });
    }
    /**
     * @param roleId
     * @param organizationUnitId
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitRemoverolefromorganizationunitDelete(
        roleId?: number,
        organizationUnitId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/OrganizationUnit/RemoveRoleFromOrganizationUnit',
            query: {
                'RoleId': roleId,
                'OrganizationUnitId': organizationUnitId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitAdduserstoorganizationunitPost(
        requestBody?: UsersToOrganizationUnitInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/OrganizationUnit/AddUsersToOrganizationUnit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitAddrolestoorganizationunitPost(
        requestBody?: RolesToOrganizationUnitInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/OrganizationUnit/AddRolesToOrganizationUnit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfFindOrganizationUnitUsersOutputDto Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitFindusersPost(
        requestBody?: FindOrganizationUnitUsersInput,
    ): CancelablePromise<PagedResultDtoOfFindOrganizationUnitUsersOutputDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/OrganizationUnit/FindUsers',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfNameValueDto Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitFindrolesPost(
        requestBody?: FindOrganizationUnitRolesInput,
    ): CancelablePromise<PagedResultDtoOfNameValueDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/OrganizationUnit/FindRoles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns OrganizationUnitDto Success
     * @throws ApiError
     */
    public static apiServicesAppOrganizationunitGetallGet(): CancelablePromise<Array<OrganizationUnitDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/OrganizationUnit/GetAll',
        });
    }
}
