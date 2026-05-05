/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddMockDataForApiTestInput } from '../models/AddMockDataForApiTestInput';
import type { AddMockDataForApiTestOutput } from '../models/AddMockDataForApiTestOutput';
import type { ChartTimePeriodInput } from '../models/ChartTimePeriodInput';
import type { DashboardPageInputDto } from '../models/DashboardPageInputDto';
import type { DashboardPageResultDto } from '../models/DashboardPageResultDto';
import type { EditUserProfileInput } from '../models/EditUserProfileInput';
import type { EditUserProfileOutput } from '../models/EditUserProfileOutput';
import type { FetchDataFromImageFromUrlResultDto } from '../models/FetchDataFromImageFromUrlResultDto';
import type { FollowedOfferStatusResultDto } from '../models/FollowedOfferStatusResultDto';
import type { FollowedOfferStatusTimeFilter } from '../models/FollowedOfferStatusTimeFilter';
import type { FollowProviderInput } from '../models/FollowProviderInput';
import type { GetBalanceChangeChartOutput } from '../models/GetBalanceChangeChartOutput';
import type { GetCurrentAppUserProfilePictureOutput } from '../models/GetCurrentAppUserProfilePictureOutput';
import type { GetMonthlyProfitLossChartOutput } from '../models/GetMonthlyProfitLossChartOutput';
import type { GetPerformanceByAssetChartOutput } from '../models/GetPerformanceByAssetChartOutput';
import type { GetPnLSequenceChartOutput } from '../models/GetPnLSequenceChartOutput';
import type { GetRewardToRiskChartOutput } from '../models/GetRewardToRiskChartOutput';
import type { GetSignalSequenceQualityChartOutput } from '../models/GetSignalSequenceQualityChartOutput';
import type { MarketViewInput } from '../models/MarketViewInput';
import type { OfferedPosiotionsInput } from '../models/OfferedPosiotionsInput';
import type { PagedResultDtoOfMarketViewDto } from '../models/PagedResultDtoOfMarketViewDto';
import type { PagedResultDtoOfOfferedPositionsDto } from '../models/PagedResultDtoOfOfferedPositionsDto';
import type { PagedResultDtoOfPositionViewDto } from '../models/PagedResultDtoOfPositionViewDto';
import type { PagedResultDtoOfReferralTransactionOutPutDto } from '../models/PagedResultDtoOfReferralTransactionOutPutDto';
import type { PagedResultDtoOfShowPositionsDto } from '../models/PagedResultDtoOfShowPositionsDto';
import type { PagedResultDtoOfSignalProviderInfoDto } from '../models/PagedResultDtoOfSignalProviderInfoDto';
import type { PositionViewInput } from '../models/PositionViewInput';
import type { ReferralInput } from '../models/ReferralInput';
import type { SettingInput } from '../models/SettingInput';
import type { ShowPositionInputDto } from '../models/ShowPositionInputDto';
import type { SignalProviderInfoInput } from '../models/SignalProviderInfoInput';
import type { SubmitSignalFromUserInputDto } from '../models/SubmitSignalFromUserInputDto';
import type { UserSubscriptionPlanDetailsDto } from '../models/UserSubscriptionPlanDetailsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserDashboardService {
    /**
     * @param requestBody
     * @returns FollowedOfferStatusResultDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardFollowedofferstatusPost(
        requestBody?: FollowedOfferStatusTimeFilter,
    ): CancelablePromise<FollowedOfferStatusResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/FollowedOfferStatus',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns DashboardPageResultDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetdashboardpagePost(
        requestBody?: DashboardPageInputDto,
    ): CancelablePromise<DashboardPageResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/GetDashboardPage',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfShowPositionsDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardShowpositionsPost(
        requestBody?: ShowPositionInputDto,
    ): CancelablePromise<PagedResultDtoOfShowPositionsDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/ShowPositions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns string Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetcurrentusermt5TokenGet(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserDashboard/GetCurrentUserMt5Token',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardSubmitsignalfromuserinputPost(
        requestBody?: SubmitSignalFromUserInputDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/SubmitSignalFromUserInput',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardSubmitsignalfromimageanalysisPost(
        requestBody?: FetchDataFromImageFromUrlResultDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/SubmitSignalFromImageAnalysis',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns EditUserProfileOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardEditinguserprofilePost(
        requestBody?: EditUserProfileInput,
    ): CancelablePromise<EditUserProfileOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/EditingUserProfile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param formData
     * @returns boolean Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardUploadandapplyprofilepicturePost(
        formData?: {
            file?: Blob;
        },
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/UploadAndApplyProfilePicture',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @returns GetCurrentAppUserProfilePictureOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetcurrentappuserprofilepictureGet(): CancelablePromise<GetCurrentAppUserProfilePictureOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserDashboard/GetCurrentAppUserProfilePicture',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfPositionViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardSignalpositionviewPost(
        requestBody?: PositionViewInput,
    ): CancelablePromise<PagedResultDtoOfPositionViewDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/SignalPositionView',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfMarketViewDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetmarketsPost(
        requestBody?: MarketViewInput,
    ): CancelablePromise<PagedResultDtoOfMarketViewDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/GetMarkets',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardFollowunfollowsignalproviderPost(
        requestBody?: FollowProviderInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/FollowUnfollowSignalProvider',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfSignalProviderInfoDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetallsignalproviderinfoPost(
        requestBody?: SignalProviderInfoInput,
    ): CancelablePromise<PagedResultDtoOfSignalProviderInfoDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/GetAllSignalProviderInfo',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardPositionssettingPost(
        requestBody?: SettingInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/PositionsSetting',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfOfferedPositionsDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardOfferedpositionsPost(
        requestBody?: OfferedPosiotionsInput,
    ): CancelablePromise<PagedResultDtoOfOfferedPositionsDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/OfferedPositions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns PagedResultDtoOfReferralTransactionOutPutDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardReferraltransactionsPost(
        requestBody?: ReferralInput,
    ): CancelablePromise<PagedResultDtoOfReferralTransactionOutPutDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/ReferralTransactions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetMonthlyProfitLossChartOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetmonthlyprofitlosschartPost(
        requestBody?: ChartTimePeriodInput,
    ): CancelablePromise<GetMonthlyProfitLossChartOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/GetMonthlyProfitLossChart',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetSignalSequenceQualityChartOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetsignalsequencequalitychartPost(
        requestBody?: ChartTimePeriodInput,
    ): CancelablePromise<GetSignalSequenceQualityChartOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/GetSignalSequenceQualityChart',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetBalanceChangeChartOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetbalancechangechartPost(
        requestBody?: ChartTimePeriodInput,
    ): CancelablePromise<GetBalanceChangeChartOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/GetBalanceChangeChart',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetRewardToRiskChartOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetrewardtoriskchartPost(
        requestBody?: ChartTimePeriodInput,
    ): CancelablePromise<GetRewardToRiskChartOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/GetRewardToRiskChart',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetPnLSequenceChartOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetpnlsequencechartPost(
        requestBody?: ChartTimePeriodInput,
    ): CancelablePromise<GetPnLSequenceChartOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/GetPnLSequenceChart',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns GetPerformanceByAssetChartOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetperformancebyassetchartPost(
        requestBody?: ChartTimePeriodInput,
    ): CancelablePromise<GetPerformanceByAssetChartOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/GetPerformanceByAssetChart',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns UserSubscriptionPlanDetailsDto Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardGetmysubscriptionplandetailsGet(): CancelablePromise<UserSubscriptionPlanDetailsDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/services/app/UserDashboard/GetMySubscriptionPlanDetails',
        });
    }
    /**
     * @param requestBody
     * @returns AddMockDataForApiTestOutput Success
     * @throws ApiError
     */
    public static apiServicesAppUserdashboardAddmockdataforapitestPost(
        requestBody?: AddMockDataForApiTestInput,
    ): CancelablePromise<AddMockDataForApiTestOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/services/app/UserDashboard/AddMockDataForApiTest',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
