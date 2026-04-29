/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserListRoleDto } from './UserListRoleDto';
export type UserListDto = {
    id?: number;
    name?: string | null;
    surname?: string | null;
    userName?: string | null;
    emailAddress?: string | null;
    lockoutEndDateUtc?: string | null;
    phoneNumber?: string | null;
    profilePictureId?: string | null;
    isEmailConfirmed?: boolean;
    roles?: Array<UserListRoleDto> | null;
    isActive?: boolean;
    creationTime?: string;
};

