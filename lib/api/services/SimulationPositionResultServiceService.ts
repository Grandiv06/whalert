/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SimulationPositionResultServiceService {
    /**
     * @param tradingSignalId
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppSimulationpositionresultserviceProcessnewsignalPost(
        tradingSignalId?: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SimulationPositionResultService/ProcessNewSignal',
            query: {
                'tradingSignalId': tradingSignalId,
            },
        });
    }
}
