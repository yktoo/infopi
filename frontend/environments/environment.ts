// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    refreshRates: {
        clock:   500,
        weather: 10 * 60 * 1000,     // Once in 10 minutes
        departures: 30 * 1000,       // Once half a minute
    },
    trainDepTimesStation1: 'htnc',   // Houten Castellum
    trainDepTimesStation2: 'ut',     // Utrecht Centraal
    ovapiBusStopCode:      'hoterv', // De Erven/De Schaft
    buienRadarStationId:   '6260',   // Meetstation De Bilt
    openHabServerUrl:      'http://pihub:8080'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
