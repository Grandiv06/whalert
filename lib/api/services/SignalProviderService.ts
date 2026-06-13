/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelPendingSignalInput } from '../models/CancelPendingSignalInput';
import type { ConfirmDetectedSignalOutcomeInput } from '../models/ConfirmDetectedSignalOutcomeInput';
import type { CreateProviderTeamAccountInput } from '../models/CreateProviderTeamAccountInput';
import type { DeclareSignalOutcomeInput } from '../models/DeclareSignalOutcomeInput';
import type { GetDeliveryChannelsOutput } from '../models/GetDeliveryChannelsOutput';
import type { GetMySignalForEditInput } from '../models/GetMySignalForEditInput';
import type { GetMySignalForEditOutput } from '../models/GetMySignalForEditOutput';
import type { GetProvidedSignalDetailInput } from '../models/GetProvidedSignalDetailInput';
import type { GetProviderSubscribersInput } from '../models/GetProviderSubscribersInput';
import type { GetProviderTeamAccountsOutput } from '../models/GetProviderTeamAccountsOutput';
import type { NewSignalInput } from '../models/NewSignalInput';
import type { PagedResultDtoOfGetProvidedOutPut } from '../models/PagedResultDtoOfGetProvidedOutPut';
import type { PagedResultDtoOfProviderSubscriberDto } from '../models/PagedResultDtoOfProviderSubscriberDto';
import type { ProvidedInput } from '../models/ProvidedInput';
import type { ProviderOverviewOutput } from '../models/ProviderOverviewOutput';
import type { ProviderSettingsOutput } from '../models/ProviderSettingsOutput';
import type { ProviderSignalDetailDto } from '../models/ProviderSignalDetailDto';
import type { ProviderSubscriberDto } from '../models/ProviderSubscriberDto';
import type { ProviderTeamAccountDto } from '../models/ProviderTeamAccountDto';
import type { RemoveProviderSubscriberInput } from '../models/RemoveProviderSubscriberInput';
import type { SetDeliveryChannelInput } from '../models/SetDeliveryChannelInput';
import type { SetProviderTeamAccountPasswordInput } from '../models/SetProviderTeamAccountPasswordInput';
import type { SignalOutcomeWorkbenchOutput } from '../models/SignalOutcomeWorkbenchOutput';
import type { SignalSide } from '../models/SignalSide';
import type { UpdateProviderSettingsInput } from '../models/UpdateProviderSettingsInput';
import type { UpdateProviderSubscriberInput } from '../models/UpdateProviderSubscriberInput';
import type { UpdateProviderTeamAccountInput } from '../models/UpdateProviderTeamAccountInput';
import type { UploadSignalPictureOutput } from '../models/UploadSignalPictureOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignalProviderService {
    /**
     * @returns ProviderOverviewOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetoverviewPost(): CancelablePromise<ProviderOverviewOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetOverview',
        });
    }
    /**
     * @returns GetProviderTeamAccountsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetproviderteamaccountsPost(): CancelablePromise<GetProviderTeamAccountsOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetProviderTeamAccounts',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderTeamAccountDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderCreateproviderteamaccountPost(
        requestBody?: CreateProviderTeamAccountInput,
    ): CancelablePromise<ProviderTeamAccountDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/CreateProviderTeamAccount',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderTeamAccountDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderUpdateproviderteamaccountPost(
        requestBody?: UpdateProviderTeamAccountInput,
    ): CancelablePromise<ProviderTeamAccountDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/UpdateProviderTeamAccount',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderSetproviderteamaccountpasswordPost(
        requestBody?: SetProviderTeamAccountPasswordInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/SetProviderTeamAccountPassword',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfProviderSubscriberDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetprovidersubscribersPost(
        requestBody?: GetProviderSubscribersInput,
    ): CancelablePromise<PagedResultDtoOfProviderSubscriberDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetProviderSubscribers',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderSubscriberDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderUpdateprovidersubscriberPost(
        requestBody?: UpdateProviderSubscriberInput,
    ): CancelablePromise<ProviderSubscriberDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/UpdateProviderSubscriber',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderRemoveprovidersubscriberPost(
        requestBody?: RemoveProviderSubscriberInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/RemoveProviderSubscriber',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ProviderSettingsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetprovidersettingsPost(): CancelablePromise<ProviderSettingsOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetProviderSettings',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderSettingsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderUpdateprovidersettingsPost(
        requestBody?: UpdateProviderSettingsInput,
    ): CancelablePromise<ProviderSettingsOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/UpdateProviderSettings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns GetDeliveryChannelsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetdeliverychannelsPost(): CancelablePromise<GetDeliveryChannelsOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetDeliveryChannels',
        });
    }
    /**
     * @param requestBody
     * @returns GetDeliveryChannelsOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderSetdeliverychannelPost(
        requestBody?: SetDeliveryChannelInput,
    ): CancelablePromise<GetDeliveryChannelsOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/SetDeliveryChannel',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns SignalOutcomeWorkbenchOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetsignaloutcomeworkbenchPost(): CancelablePromise<SignalOutcomeWorkbenchOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetSignalOutcomeWorkbench',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderConfirmdetectedsignaloutcomePost(
        requestBody?: ConfirmDetectedSignalOutcomeInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/ConfirmDetectedSignalOutcome',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfGetProvidedOutPut Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetprovidedpositionsPost(
        requestBody?: ProvidedInput,
    ): CancelablePromise<PagedResultDtoOfGetProvidedOutPut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetProvidedPositions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfGetProvidedOutPut Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetmycreatedsignalsPost(
        requestBody?: ProvidedInput,
    ): CancelablePromise<PagedResultDtoOfGetProvidedOutPut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetMyCreatedSignals',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetMySignalForEditOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetmysignalforeditPost(
        requestBody?: GetMySignalForEditInput,
    ): CancelablePromise<GetMySignalForEditOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetMySignalForEdit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderSignalDetailDto Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderGetprovidedsignaldetailPost(
        requestBody?: GetProvidedSignalDetailInput,
    ): CancelablePromise<ProviderSignalDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/GetProvidedSignalDetail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderAddnewsignalPost(
        requestBody?: NewSignalInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/AddNewSignal',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param formData
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderAddnewsignalwithpicturePost(
        formData?: {
            Symbol?: string;
            EntryPoint?: number;
            Sl?: number;
            TPs?: string;
            PictureId?: string;
            PictureToken?: string;
            Description?: string;
            Side?: SignalSide;
            Picture?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/AddNewSignalWithPicture',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param formData
     * @returns UploadSignalPictureOutput Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderUploadsignalpicturePost(
        formData?: {
            file?: Blob;
        },
    ): CancelablePromise<UploadSignalPictureOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/UploadSignalPicture',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderDeclaresignaloutcomePost(
        requestBody?: DeclareSignalOutcomeInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/DeclareSignalOutcome',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppSignalproviderCancelpendingsignalPost(
        requestBody?: CancelPendingSignalInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/SignalProvider/CancelPendingSignal',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
