/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationUnitDto } from './OrganizationUnitDto';
import type { UserEditDto } from './UserEditDto';
import type { UserRoleDto } from './UserRoleDto';
export type GetUserForEditOutput = {
    profilePictureId?: string | null;
    user?: UserEditDto;
    roles?: Array<UserRoleDto> | null;
    allOrganizationUnits?: Array<OrganizationUnitDto> | null;
    memberedOrganizationUnits?: Array<string> | null;
    allowedUserNameCharacters?: string | null;
    isSMTPSettingsProvided?: boolean;
};

