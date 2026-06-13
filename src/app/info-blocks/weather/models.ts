// Weather data model definitions for JSON provided by https://data.buienradar.nl/2.0/feed/json

export interface RawBuienradarWeatherResponse {
    readonly Metadata: RawBuienradarWeatherMetadata;
    readonly Actual:   RawBuienradarActualWeather;
    readonly Forecast: RawBuienradarWeatherForecast;
}

export interface RawBuienradarWeatherMetadata {
    readonly Copyright: string; // "(C)opyright Buienradar / RTL. Alle rechten voorbehouden",
    readonly Terms:     string; // "Deze feed mag vrij worden gebruikt onder voorwaarde van bronvermelding buienradar.nl inclusief een hyperlink naar https://www.buienradar.nl. Aan de feed kunnen door gebruikers of andere personen geen rechten worden ontleend."
}

export interface RawBuienradarActualWeather {
    readonly ActualRadarUrl:      string; // "https://api.buienradar.nl/image/1.0/RadarMapNL?w=500\u0026h=512"
    readonly Sunrise:             string; // "2026-06-13T05:14:00"
    readonly Sunset:              string; // "2026-06-13T22:00:00"
    readonly WeatherStationMeasurements: RawBuienradarWeatherStationMeasurements[];
}

export interface RawBuienradarWeatherForecast {
    readonly WeatherReport:     RawBuienradarWeatherReport;
    readonly ShortTermForecast: RawBuienradarWeatherTermForecast;
    readonly LongTerm:          RawBuienradarWeatherTermForecast;
    readonly FiveDayForecast:   RawBuienradarDayWeatherForecast[];
}

export interface RawBuienradarWeatherStationMeasurements {
    readonly StationId:            number; // 6275
    readonly StationName:          string; // "Meetstation Arnhem"
    readonly Latitude:             number; // 52.07
    readonly Longitude:            number; // 5.88
    readonly Region:               string; // "Arnhem"
    readonly Timestamp:            string; // "2026-04-08T10:10:00"
    readonly WeatherDescription:   string; // "Vrijwel onbewolkt (zonnig/helder)"
    readonly IconUrl:              string; // "https://cdn.buienradar.nl/resources/images/icons/weather/30x30/a.png"
    readonly FullIconUrl:          string; // "https://cdn.buienradar.nl/resources/images/icons/weather/96x96/A.png"
    readonly GraphUrl:             string; // "https://www.buienradar.nl/nederland/weerbericht/weergrafieken/a"
    readonly WindDirection:        number; // 11
    readonly AirPressure:          number; // 1026.5
    readonly Temperature:          number; // 12.9
    readonly GroundTemperature:    number; // 12.2
    readonly FeelTemperature:      number; // 11.7
    readonly Visibility:           number; // 43500.0
    readonly WindGusts:            number; // 4.8
    readonly Windspeed:            number; // 3.6
    readonly WindspeedBeaufort:    null;
    readonly Humidity:             number; // 39.0
    readonly Precipitation:        number; // 0.0
    readonly Sunpower:             number; // 452.0
    readonly RainfallLast24Hour:   number; // 0.0
    readonly RainfallLastHour:     number; // 0
    readonly WindDirectionDegrees: number; // 246
    readonly DayHistory:           null
}

export interface RawBuienradarWeatherReport {
    readonly Published: string; // "2026-04-08T08:00:00"
    readonly Title:     string; // "Volop zon en warm voor april"
    readonly Summary:   string; // "Vandaag is het een echte toplentedag met volop zon..."
    readonly Text:      string; // "Vandaag is het een echte toplentedag met volop zon..."
    readonly Author:    string; // "Ed Aldus",
    readonly Authorbio: string; // "Sinds februari 2008 werkzaam voor Buienradar..."
    readonly Url:       null;
}

export interface RawBuienradarWeatherTermForecast {
    readonly StartDate: string; // "2026-04-14T00:00:00"
    readonly EndDate:   string; // "2026-04-18T00:00:00"
    readonly Forecast:  string; // "Grote kans (60%) op een rustig, meest droog en zonnig weertype, met temperaturen rond het langjarig..."
}

export interface RawBuienradarDayWeatherForecast {
    readonly Day:                string; // "2026-04-08T00:00:00"
    readonly MinTemperature:     string; // "2"
    readonly MaxTemperature:     string; // "18"
    readonly MinTemperatureMax:  number; // 2
    readonly MinTemperatureMin:  number; // 2
    readonly MaxTemperatureMax:  number; // 18
    readonly MaxTemperatureMin:  number; // 18
    readonly RainChance:         number; // 0
    readonly SunChance:          number; // 100
    readonly WindDirection:      string; // "o"
    readonly WindBeaufort:       number; // 3
    readonly RainMinMm:          number; // 0.0
    readonly RainMaxMm:          number; // 0.0
    readonly WeatherDescription: string; // "Vrijwel onbewolkt (zonnig/helder)"
    readonly IconUrl:            string; // "https://cdn.buienradar.nl/resources/images/icons/weather/30x30/a.png"
    readonly FullIconUrl:        string; // "https://cdn.buienradar.nl/resources/images/icons/weather/96x96/A.png"
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
