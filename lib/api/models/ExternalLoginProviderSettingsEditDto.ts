/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FacebookExternalLoginProviderSettings } from './FacebookExternalLoginProviderSettings';
import type { GoogleExternalLoginProviderSettings } from './GoogleExternalLoginProviderSettings';
import type { JsonClaimMapDto } from './JsonClaimMapDto';
import type { MicrosoftExternalLoginProviderSettings } from './MicrosoftExternalLoginProviderSettings';
import type { OpenIdConnectExternalLoginProviderSettings } from './OpenIdConnectExternalLoginProviderSettings';
import type { TwitterExternalLoginProviderSettings } from './TwitterExternalLoginProviderSettings';
import type { WsFederationExternalLoginProviderSettings } from './WsFederationExternalLoginProviderSettings';
export type ExternalLoginProviderSettingsEditDto = {
    facebook_IsDeactivated?: boolean;
    facebook?: FacebookExternalLoginProviderSettings;
    google_IsDeactivated?: boolean;
    google?: GoogleExternalLoginProviderSettings;
    twitter_IsDeactivated?: boolean;
    twitter?: TwitterExternalLoginProviderSettings;
    microsoft_IsDeactivated?: boolean;
    microsoft?: MicrosoftExternalLoginProviderSettings;
    openIdConnect_IsDeactivated?: boolean;
    openIdConnect?: OpenIdConnectExternalLoginProviderSettings;
    openIdConnectClaimsMapping?: Array<JsonClaimMapDto> | null;
    wsFederation_IsDeactivated?: boolean;
    wsFederation?: WsFederationExternalLoginProviderSettings;
    wsFederationClaimsMapping?: Array<JsonClaimMapDto> | null;
};

