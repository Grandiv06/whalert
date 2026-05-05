/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoldPriceSeries } from './GoldPriceSeries';
export type GoldPriceCandleDto = {
    id?: number;
    intervalMinutes?: number;
    series?: GoldPriceSeries;
    bucketStart?: string;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    tickCount?: number;
};

