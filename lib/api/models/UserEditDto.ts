/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserEditDto = {
    id?: number | null;
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
    phoneNumber?: string | null;
    password?: string | null;
    isActive?: boolean;
    shouldChangePasswordOnNextLogin?: boolean;
    isTwoFactorEnabled?: boolean;
    isLockoutEnabled?: boolean;
};

