import { InfoPiConfig } from '../app/core/config/config';

export const configuration: Partial<InfoPiConfig> = {
    // Clock settings
    clock: {
        enabled: true,
        refreshRate: 1000 /* Once a second */,
    },

    // Weather settings
    weather: {
        enabled: true,
        refreshRate: 10 * 60 * 1000 /* Once in 10 minutes */,
        buienRadarStationId: 6260   /* Meetstation De Bilt */,
    },

    // Train settings
    trainSchedule: {
        enabled: true,
        nsApiKey: '-your-key-here-',
        refreshRate: 30 * 1000 /* Once half a minute */,
        departureStationName: 'Houten Castellum',
        departureStationCode: 'htnc',
        maxDepartureCount: 12,
    },

    // Bus settings
    busSchedule: {
        enabled: true,
        refreshRate: 30 * 1000  /* Once half a minute */,
        ovapiStopName: 'De Erven/De Schaft',
        ovapiStopCode: 'hoterv',
        maxDepartureCount: 12,
    },

    // FX settings
    fxRates: {
        enabled: true,
        refreshRate: 60 * 60 * 1000  /* Once an hour */,
        baseCurrency: 'RUB',
        showCurrencies: {EUR: '€', USD: '$', GBP: '£', CHF: 'Fr'},
    },

    // Home automation settings
    homeAutomation: {
        enabled: true,
        refreshRate: 10 * 1000  /* Once every 10 seconds */,
        openHabServerUrl: 'http://pihub:8080',
        showGroup: 'gSecurity',
    },

    // RSS settings
    rssFeed: {
        enabled: true,
        refreshRate: 10 * 60 * 1000 /* Once in 10 minutes */,
        displayDuration: 10 * 1000  /* 10 seconds */,
        feedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    },

    // Waste collection schedule settings
    wasteSchedule: {
        enabled:              true,
        refreshRate:          6 * 60 * 60 * 1000 /* Once in 6 hours */,
        apiKey:              '-api-key-here-',
        postalCode:          '1234AA',
        houseNumber:         '123',
        houseNumberAddition: 'XYZ',
        maxCount:            6,
    },
};
