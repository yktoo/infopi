import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Base type of information block configs. */
export interface InfoBlockConfig {
    /** Whether the block is enabled. Defaults to `false`. */
    enabled: boolean;
    /** Number of milliseconds between refreshes. */
    refreshRate: number;
}

export interface BusScheduleConfig extends InfoBlockConfig {
    /** Name of the bus stop to show busses for. */
    ovapiStopName: string;
    /** Code of the bus stop to show busses for. */
    ovapiStopCode: string;
    /** Max. number of schedule slots to display. */
    maxDepartureCount: number;
}

export interface ClockConfig extends InfoBlockConfig {
    // Nothing additional here
}

export interface FxRatesConfig extends InfoBlockConfig {
    /** Base currency to show conversion rates for. */
    baseCurrency: string;
    /** Currencies to show conversion rates from the base for. */
    showCurrencies: { [k: string]: string };
}

export interface HomeAutomationConfig extends InfoBlockConfig {
    /** URL of the OpenHAB instance. */
    openHabServerUrl: string;
    /** Device group to display. */
    showGroup: string;
}

export interface RssFeedConfig extends InfoBlockConfig {
    /** Duration to show each feed item for, in milliseconds. */
    displayDuration: number;
    /** RSS feed URL. */
    feedUrl: string;
}

export interface TrainScheduleConfig extends InfoBlockConfig {
    /** NS API key. */
    nsApiKey: string;
    /** Name of the departure station. */
    departureTimesStationName: string;
    /** Code of the departure station. */
    departureTimesStationCode: string;
    /** Max. number of departure slots to display. */
    maxDepartureCount: number;
}

export interface WasteScheduleConfig extends InfoBlockConfig {
    /** afvalwijzer.nl API key. */
    apiKey: string;
    /** Postal code of the address. */
    postalCode: string;
    /** House number of the address. */
    houseNumber: string;
    /** House number addition of the address. */
    houseNumberAddition: string;
    /** Max. number of slots to display. */
    maxCount: number;
}

export interface WeatherConfig extends InfoBlockConfig {
    /** Weather station ID for Buienradar. */
    buienRadarStationId: string;
}

export interface InfoPiConfig {
    /** Waste settings. */
    readonly wasteSchedule: WasteScheduleConfig;

    /** Clock settings. */
    readonly clock: ClockConfig;

    /** Weather settings. */
    readonly weather: WeatherConfig;

    /** Train settings. */
    readonly trainSchedule: TrainScheduleConfig;

    /** Bus settings. */
    readonly busSchedule: BusScheduleConfig;

    /** FX settings. */
    readonly fxRates: FxRatesConfig;

    /** Home automation settings. */
    readonly homeAutomation: HomeAutomationConfig;

    /** RSS settings. */
    readonly rssFeed: RssFeedConfig;
}

export class InfoPiConfigImpl implements InfoPiConfig {

    readonly busSchedule: BusScheduleConfig = {
        enabled: false,
        refreshRate: 3600 * 1000,
        ovapiStopName: '',
        ovapiStopCode: '',
        maxDepartureCount: 0,
    };
    readonly clock: ClockConfig = {
        enabled: false,
        refreshRate: 3600 * 1000,
    };
    readonly fxRates: FxRatesConfig = {
        enabled: false,
        refreshRate: 3600 * 1000,
        baseCurrency: '',
        showCurrencies: {},
    };
    readonly homeAutomation: HomeAutomationConfig = {
        enabled: false,
        refreshRate: 3600 * 1000,
        openHabServerUrl: '',
        showGroup: '',
    };
    readonly rssFeed: RssFeedConfig = {
        enabled: false,
        refreshRate: 3600 * 1000,
        displayDuration: 10 * 1000,
        feedUrl: '',
    };
    readonly trainSchedule: TrainScheduleConfig = {
        enabled: false,
        refreshRate: 3600 * 1000,
        nsApiKey: '',
        departureTimesStationName: '',
        departureTimesStationCode: '',
        maxDepartureCount: 10,
    };
    readonly wasteSchedule: WasteScheduleConfig = {
        enabled: false,
        refreshRate: 3600 * 1000,
        apiKey: '',
        postalCode: '',
        houseNumber: '',
        houseNumberAddition: '',
        maxCount: 6,
    };
    readonly weather: WeatherConfig = {
        enabled: false,
        refreshRate: 3600 * 1000,
        buienRadarStationId: '',
    };

    constructor(init: Partial<InfoPiConfig>) {
        Object.assign(this, init);
    }
}

/** Application configuration, obtained via environment. */
export const APP_CONFIG = new InjectionToken<InfoPiConfig>('APP_CONFIG', {factory: () => new InfoPiConfigImpl(environment.configuration)});
