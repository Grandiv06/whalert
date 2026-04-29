/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateInvoiceDto } from '../models/CreateInvoiceDto';
import type { InvoiceDto } from '../models/InvoiceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvoiceService {
    /**
     * @param id
     * @returns InvoiceDto Success
     * @throws ApiError
     */
    public static apiServicesAppInvoiceGetinvoiceinfoGet(
        id?: number,
    ): CancelablePromise<InvoiceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/Invoice/GetInvoiceInfo',
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
    public static apiServicesAppInvoiceCreateinvoicePost(
        requestBody?: CreateInvoiceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/Invoice/CreateInvoice',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
