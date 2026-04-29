/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListResultDtoOfFlatPermissionWithLevelDto } from '../models/ListResultDtoOfFlatPermissionWithLevelDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PermissionService {
    /**
     * @returns ListResultDtoOfFlatPermissionWithLevelDto Success
     * @throws ApiError
     */
    public static apiServicesAppPermissionGetallpermissionsGet(): CancelablePromise<ListResultDtoOfFlatPermissionWithLevelDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Permission/GetAllPermissions',
        });
    }
}
