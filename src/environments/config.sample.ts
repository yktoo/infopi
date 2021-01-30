export const configuration = {
    // API settings
    api: {
        nsApiKey: '-your-key-here-',
    },

    // Clock settings
    clock: {
        refreshRate: 1000 /* Once a second */,
    },

    // Weather settings
    weather: {
        refreshRate: 10 * 60 * 1000 /* Once in 10 minutes */,
        buienRadarStationId: '6260' /* Meetstation De Bilt */,
    },

    // Train settings
    trains: {
        refreshRate: 30 * 1000   /* Once half a minute */,
        departureTimesStationName: 'Houten Castellum',
        departureTimesStationCode: 'htnc',
        maxDepartureCount: 12,
    },

    // Bus settings
    busses: {
        refreshRate: 30 * 1000  /* Once half a minute */,
        ovapiStopName: 'De Erven/De Schaft',
        ovapiStopCode: 'hoterv',
        maxDepartureCount: 12,
    },

    // FX settings
    fx: {
        refreshRate: 60 * 60 * 1000  /* Once an hour */,
        baseCurrency: 'RUB',
        showCurrencies: {EUR: '€', USD: '$', GBP: '£', CHF: 'Fr'},
    },

    // Home automation settings
    domotics: {
        refreshRate: 10 * 1000  /* Once every 10 seconds */,
        openHabServerUrl: 'http://pihub:8080',
        showGroup: 'gSecurity',
    },

    // RSS settings
    rss: {
        refreshRate: 10 * 60 * 1000 /* Once in 10 minutes */,
        displayDuration: 10 * 1000  /* 10 seconds */,
        feedUrl: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    },

    // Picture settings
    pic: {
        refreshRate: 4 * 3600 * 1000  /* Once in 4 hours */,
        url: 'https://raw.githubusercontent.com/J535D165/CoronaWatchNL/master/plots/overview_plot.png',
    },
};
