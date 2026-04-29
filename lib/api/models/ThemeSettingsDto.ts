/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ThemeFooterSettingsDto } from './ThemeFooterSettingsDto';
import type { ThemeHeaderSettingsDto } from './ThemeHeaderSettingsDto';
import type { ThemeLayoutSettingsDto } from './ThemeLayoutSettingsDto';
import type { ThemeMenuSettingsDto } from './ThemeMenuSettingsDto';
import type { ThemeSubHeaderSettingsDto } from './ThemeSubHeaderSettingsDto';
import type { ThemeToolbarSettingsDto } from './ThemeToolbarSettingsDto';
export type ThemeSettingsDto = {
    theme?: string | null;
    layout?: ThemeLayoutSettingsDto;
    header?: ThemeHeaderSettingsDto;
    subHeader?: ThemeSubHeaderSettingsDto;
    menu?: ThemeMenuSettingsDto;
    footer?: ThemeFooterSettingsDto;
    toolbar?: ThemeToolbarSettingsDto;
};

