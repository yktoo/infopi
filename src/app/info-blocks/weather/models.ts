// Weather data model definitions for JSON provided by https://data.buienradar.nl/2.0/feed/json

export interface RawBuienradarWeatherResponse {
    readonly buienradar: RawBuienradarWeatherMetadata;
    readonly actual:     RawBuienradarActualWeather;
    readonly forecast:   RawBuienradarWeatherForecast;
}

export interface RawBuienradarWeatherMetadata {
    readonly copyright: string;
    readonly terms:     string;
}

export interface RawBuienradarActualWeather {
    readonly actualradarurl:      string;
    readonly sunrise:             string;
    readonly sunset:              string;
    readonly stationmeasurements: RawBuienradarStationMeasurement[];
}

export interface RawBuienradarWeatherForecast {
    readonly weatherreport:   RawBuienradarWeatherReport;
    readonly shortterm:       RawBuienradarWeatherTermForecast;
    readonly longterm:        RawBuienradarWeatherTermForecast;
    readonly fivedayforecast: RawBuienradarDayWeatherForecast[];
}

export interface RawBuienradarStationMeasurement {
    readonly stationid:            number; // 6275
    readonly stationname:          string; // "Meetstation Arnhem"
    readonly lat:                  number; // 52.07
    readonly lon:                  number; // 5.88
    readonly regio:                string; // "Arnhem"
    readonly timestamp:            string; // "2026-04-08T10:10:00"
    readonly weatherdescription:   string; // "Vrijwel onbewolkt (zonnig/helder)"
    readonly iconurl:              string; // "https://cdn.buienradar.nl/resources/images/icons/weather/30x30/a.png"
    readonly fullIconUrl:          string; // "https://cdn.buienradar.nl/resources/images/icons/weather/96x96/A.png"
    readonly graphUrl:             string; // "https://www.buienradar.nl/nederland/weerbericht/weergrafieken/a"
    readonly winddirection:        string; // "OZO"
    readonly airpressure:          number; // 1026.5
    readonly temperature:          number; // 12.9
    readonly groundtemperature:    number; // 12.2
    readonly feeltemperature:      number; // 11.7
    readonly visibility:           number; // 43500.0
    readonly windgusts:            number; // 4.8
    readonly windspeed:            number; // 3.6
    readonly windspeedBft:         number; // 3
    readonly humidity:             number; // 39.0
    readonly precipitation:        number; // 0.0
    readonly sunpower:             number; // 452.0
    readonly rainFallLastHour:     number; // 0.0
    readonly winddirectiondegrees: number; // 108
}

export interface RawBuienradarWeatherReport {
    readonly published: string; // "2026-04-08T08:00:00"
    readonly title:     string; // "Volop zon en warm voor april"
    readonly summary:   string; // "Vandaag is het een echte toplentedag met volop zon..."
    readonly text:      string; // "Vandaag is het een echte toplentedag met volop zon..."
    readonly author:    string; // "Ed Aldus",
    readonly authorbio: string; // "Sinds februari 2008 werkzaam voor Buienradar..."
}

export interface RawBuienradarWeatherTermForecast {
    readonly startdate: string; // "2026-04-14T00:00:00"
    readonly enddate:   string; // "2026-04-18T00:00:00"
    readonly forecast:  string; // "Grote kans (60%) op een rustig, meest droog en zonnig weertype, met temperaturen rond het langjarig..."
}

export interface RawBuienradarDayWeatherForecast {
    readonly day:                string; // "2026-04-08T00:00:00"
    readonly mintemperature:     string; // "2"
    readonly maxtemperature:     string; // "18"
    readonly mintemperatureMax:  number; // 2
    readonly mintemperatureMin:  number; // 2
    readonly maxtemperatureMax:  number; // 18
    readonly maxtemperatureMin:  number; // 18
    readonly rainChance:         number; // 0
    readonly sunChance:          number; // 100
    readonly windDirection:      string; // "o"
    readonly wind:               number; // 3
    readonly mmRainMin:          number; // 0.0
    readonly mmRainMax:          number; // 0.0
    readonly weatherdescription: string; // "Vrijwel onbewolkt (zonnig/helder)"
    readonly iconurl:            string; // "https://cdn.buienradar.nl/resources/images/icons/weather/30x30/a.png"
    readonly fullIconUrl:        string; // "https://cdn.buienradar.nl/resources/images/icons/weather/96x96/A.png"
}

//------------------------------------------------------------------------------------------------------------------------------------------
// Derived data
//------------------------------------------------------------------------------------------------------------------------------------------

export interface CurrentWeather {
    readonly  station: {
        readonly  code:      number;
        readonly  name:      string;
        readonly  latitude:  number;
        readonly  longitude: number;
        readonly  updated:   Date;
    };
    readonly temperature:    number; // In °C
    readonly humidity:       number; // In %
    readonly pressure:       number; // In hPa
    readonly wind: {
        readonly dirText:    string; // Text, like 'WZW'
        readonly dirDegrees: number; // In degrees
        readonly speed:      number; // In m/s
        readonly speedBft:   number; // In bft
        readonly gusts:      number; // In m/s
    };
    readonly rain:           number; // In mm/h
    readonly visibility:     number; // In metres
    readonly icon:           string; // One of the wi-* classes
    readonly description:    string; // Short weather description
    readonly message:        string;
}

export interface WeatherDayForecast {
    readonly date:            Date;   // Day the forecast is about
    readonly probSun:         number; // Sun probability in percent
    readonly rain: {
        readonly probability: number; // Probability in percent
        readonly minAmount:   number; // Minimum amount in mm
        readonly maxAmount:   number; // Maximum amount in mm
    };
    readonly temperature: {
        readonly highMax:     number; // In °C
        readonly highMin:     number; // In °C
        readonly lowMax:      number; // In °C
        readonly lowMin:      number; // In °C
    };
    readonly wind: {
        readonly dirText:     string; // Text, like 'WZW'
        readonly speedBft:    number; // In bft
    };
    readonly icon:            string; // One of the wi-* classes
}

/** Astronomic data about the sun and the moon. */
export interface AstroData {
    /** Time of sunrise. */
    sunrise: Date,
    /** Time of sunset. */
    sunset: Date,
    /** Moon phase in days (0..27). */
    moonPhase: number,
}
