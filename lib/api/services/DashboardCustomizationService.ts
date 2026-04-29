/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddNewPageInput } from '../models/AddNewPageInput';
import type { AddNewPageOutput } from '../models/AddNewPageOutput';
import type { AddWidgetInput } from '../models/AddWidgetInput';
import type { Dashboard } from '../models/Dashboard';
import type { DashboardOutput } from '../models/DashboardOutput';
import type { RenamePageInput } from '../models/RenamePageInput';
import type { SavePageInput } from '../models/SavePageInput';
import type { Widget } from '../models/Widget';
import type { WidgetOutput } from '../models/WidgetOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DashboardCustomizationService {
    /**
     * @param dashboardName
     * @param application
     * @returns Dashboard Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationGetuserdashboardGet(
        dashboardName?: string,
        application?: string,
    ): CancelablePromise<Dashboard> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DashboardCustomization/GetUserDashboard',
            query: {
                'DashboardName': dashboardName,
                'Application': application,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationSavepagePost(
        requestBody?: SavePageInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DashboardCustomization/SavePage',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationRenamepagePost(
        requestBody?: RenamePageInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DashboardCustomization/RenamePage',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns AddNewPageOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationAddnewpagePost(
        requestBody?: AddNewPageInput,
    ): CancelablePromise<AddNewPageOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DashboardCustomization/AddNewPage',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param dashboardName
     * @param application
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationDeletepageDelete(
        id?: string,
        dashboardName?: string,
        application?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/services/app/DashboardCustomization/DeletePage',
            query: {
                'Id': id,
                'DashboardName': dashboardName,
                'Application': application,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Widget Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationAddwidgetPost(
        requestBody?: AddWidgetInput,
    ): CancelablePromise<Widget> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/DashboardCustomization/AddWidget',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param dashboardName
     * @param application
     * @returns DashboardOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationGetdashboarddefinitionGet(
        dashboardName?: string,
        application?: string,
    ): CancelablePromise<DashboardOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DashboardCustomization/GetDashboardDefinition',
            query: {
                'DashboardName': dashboardName,
                'Application': application,
            },
        });
    }
    /**
     * @param dashboardName
     * @param application
     * @returns WidgetOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationGetallwidgetdefinitionsGet(
        dashboardName?: string,
        application?: string,
    ): CancelablePromise<Array<WidgetOutput>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DashboardCustomization/GetAllWidgetDefinitions',
            query: {
                'DashboardName': dashboardName,
                'Application': application,
            },
        });
    }
    /**
     * @param dashboardName
     * @param application
     * @param pageId
     * @returns WidgetOutput Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationGetallavailablewidgetdefinitionsforpageGet(
        dashboardName?: string,
        application?: string,
        pageId?: string,
    ): CancelablePromise<Array<WidgetOutput>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DashboardCustomization/GetAllAvailableWidgetDefinitionsForPage',
            query: {
                'DashboardName': dashboardName,
                'Application': application,
                'PageId': pageId,
            },
        });
    }
    /**
     * @param application
     * @param dashboardName
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppDashboardcustomizationGetsettingnameGet(
        application?: string,
        dashboardName?: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/DashboardCustomization/GetSettingName',
            query: {
                'application': application,
                'dashboardName': dashboardName,
            },
        });
    }
}
