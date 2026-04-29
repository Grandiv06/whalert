/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserEditDto } from './UserEditDto';
export type CreateOrUpdateUserInput = {
    user: UserEditDto;
    assignedRoleNames: Array<string>;
    sendActivationEmail?: boolean;
    setRandomPassword?: boolean;
    organizationUnits?: Array<number> | null;
};

