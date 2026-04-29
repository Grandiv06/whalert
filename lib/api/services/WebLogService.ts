/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileDto } from '../models/FileDto';
import type { GetLatestWebLogsOutput } from '../models/GetLatestWebLogsOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebLogService {
    /**
     * @returns GetLatestWebLogsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppWeblogGetlatestweblogsGet(): CancelablePromise<GetLatestWebLogsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WebLog/GetLatestWebLogs',
        });
    }
    /**
     * @returns FileDto Success
     * @throws ApiError
     */
    public static apiServicesAppWeblogDownloadweblogsPost(): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/WebLog/DownloadWebLogs',
        });
    }
}
