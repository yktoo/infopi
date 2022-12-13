export interface InfoPiConfig {
    // API settings
    api: {
        nsApiKey: string;
    };

    // Clock settings
    clock: {
        refreshRate: number;
    };

    // Weather settings
    weather: {
        refreshRate:         number;
        buienRadarStationId: string;
    };

    // Train settings
    trains: {
        refreshRate:               number;
        departureTimesStationName: string;
        departureTimesStationCode: string;
        maxDepartureCount:         number;
    };

    // Bus settings
    busses: {
        refreshRate:       number;
        ovapiStopName:     string;
        ovapiStopCode:     string;
        maxDepartureCount: number;
    };

    // FX settings
    fx: {
        refreshRate:    number;
        baseCurrency:   string;
        showCurrencies: { [k: string]: string };
    };

    // Home automation settings
    domotics: {
        refreshRate:      number;
        openHabServerUrl: string;
        showGroup:        string;
    };

    // RSS settings
    rss: {
        refreshRate:     number;
        displayDuration: number;
        feedUrl:         string;
    };

    // Chart settings
    chart: {
        refreshRate: number;
        url:         string;
        maxElements: number;
    };
}
