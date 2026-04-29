/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivateWebhookSubscriptionInput } from '../models/ActivateWebhookSubscriptionInput';
import type { ListResultDtoOfGetAllAvailableWebhooksOutput } from '../models/ListResultDtoOfGetAllAvailableWebhooksOutput';
import type { ListResultDtoOfGetAllSubscriptionsOutput } from '../models/ListResultDtoOfGetAllSubscriptionsOutput';
import type { WebhookSubscription } from '../models/WebhookSubscription';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhookSubscriptionService {
    /**
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksubscriptionPublishtestwebhookPost(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/WebhookSubscription/PublishTestWebhook',
        });
    }
    /**
     * @returns ListResultDtoOfGetAllSubscriptionsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksubscriptionGetallsubscriptionsGet(): CancelablePromise<ListResultDtoOfGetAllSubscriptionsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WebhookSubscription/GetAllSubscriptions',
        });
    }
    /**
     * @param subscriptionId
     * @returns WebhookSubscription Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksubscriptionGetsubscriptionGet(
        subscriptionId?: string,
    ): CancelablePromise<WebhookSubscription> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WebhookSubscription/GetSubscription',
            query: {
                'subscriptionId': subscriptionId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksubscriptionAddsubscriptionPost(
        requestBody?: WebhookSubscription,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/WebhookSubscription/AddSubscription',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksubscriptionUpdatesubscriptionPut(
        requestBody?: WebhookSubscription,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/services/app/WebhookSubscription/UpdateSubscription',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksubscriptionActivatewebhooksubscriptionPost(
        requestBody?: ActivateWebhookSubscriptionInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/WebhookSubscription/ActivateWebhookSubscription',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param webhookName
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksubscriptionIssubscribedPost(
        webhookName?: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/WebhookSubscription/IsSubscribed',
            query: {
                'webhookName': webhookName,
            },
        });
    }
    /**
     * @param webhookName
     * @returns ListResultDtoOfGetAllSubscriptionsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksubscriptionGetallsubscriptionsiffeaturesgrantedGet(
        webhookName?: string,
    ): CancelablePromise<ListResultDtoOfGetAllSubscriptionsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WebhookSubscription/GetAllSubscriptionsIfFeaturesGranted',
            query: {
                'webhookName': webhookName,
            },
        });
    }
    /**
     * @returns ListResultDtoOfGetAllAvailableWebhooksOutput Success
     * @throws ApiError
     */
    public static apiServicesAppWebhooksubscriptionGetallavailablewebhooksGet(): CancelablePromise<ListResultDtoOfGetAllAvailableWebhooksOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/WebhookSubscription/GetAllAvailableWebhooks',
        });
    }
}
