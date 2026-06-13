/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PositionCustomTarget } from './PositionCustomTarget';
import type { SignalSide } from './SignalSide';
export type RegisterPositionInput = {
    side?: SignalSide;
    price?: number;
    sl?: number;
    tPs?: Array<PositionCustomTarget> | null;
    fileUrl?: string | null;
    pictureId?: string | null;
    file?: string | null;
    pictureToken?: string | null;
    symbol?: string | null;
    description?: string | null;
};

