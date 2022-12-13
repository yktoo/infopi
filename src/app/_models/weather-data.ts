import { TextNode } from './gen-types';

export interface RawWeatherIcon {
    attr: {
        ID: string;
        zin?: string;
    };
    text: string;
}

export interface RawWeatherStation {
    attr: {
        id: string;
    };
    stationcode: TextNode;
    stationnaam: {
        attr: { regio: string };
        text: string;
    };
    lat: TextNode;
    lon: TextNode;
    datum: TextNode;
    luchtvochtigheid: TextNode;
    temperatuurGC: TextNode;
    windsnelheidMS: TextNode;
    windsnelheidBF: TextNode;
    windrichtingGR: TextNode;
    windrichting: TextNode;
    luchtdruk: TextNode;
    zichtmeters: TextNode;
    windstotenMS: TextNode;
    regenMMPU: TextNode;
    zonintensiteitWM2: TextNode;
    icoonactueel: RawWeatherIcon;
    temperatuur10cm: TextNode;
    url: TextNode;
    latGraden: TextNode;
    lonGraden: TextNode;
}

export interface RawWeatherDayForecast {
    datum: TextNode;
    dagweek: TextNode;
    kanszon: TextNode;
    kansregen: TextNode;
    minmmregen: TextNode;
    maxmmregen: TextNode;
    mintemp: TextNode;
    mintempmax: TextNode;
    maxtemp: TextNode;
    maxtempmax: TextNode;
    windrichting: TextNode;
    windkracht: TextNode;
    icoon: RawWeatherIcon;
    sneeuwcms: TextNode;
}

export interface RawCurrentWeather {
    weerstations: {
        weerstation: RawWeatherStation[];
    };
    buienindex: {
        waardepercentage: TextNode;
        datum: TextNode;
    };
    buienradar: {
        url: TextNode;
        urlbackup: TextNode;
        icoonactueel: RawWeatherIcon;
        zonopkomst: TextNode;
        zononder: TextNode;
    };
    aantalonweer: TextNode;
    aantalhagel: TextNode;
}

export interface RawWeatherData {
    titel: TextNode;
    link: TextNode;
    omschrijving: TextNode;
    language: TextNode;
    copyright: TextNode;
    gebruik: TextNode;
    image: {
        titel: TextNode;
        link: TextNode;
        url: TextNode;
        width: TextNode;
        height: TextNode;
    };
    actueel_weer: RawCurrentWeather;
    verwachting_meerdaags: {
        url: TextNode;
        urlbackup: TextNode;
        tekst_middellang: {
            attr: { periode: string };
            text: string;
        };
        tekst_lang: {
            attr: { periode: string };
            text: string;
        };
        'dag-plus1': RawWeatherDayForecast;
        'dag-plus2': RawWeatherDayForecast;
        'dag-plus3': RawWeatherDayForecast;
        'dag-plus4': RawWeatherDayForecast;
        'dag-plus5': RawWeatherDayForecast;
    };
    verwachting_vandaag: {
        url: TextNode;
        urlbackup: TextNode;
        titel: TextNode;
        tijdweerbericht: TextNode;
        samenvatting: TextNode;
        tekst: TextNode;
        formattedtekst: TextNode;
    };
}

export interface RawWeather {
    buienradarnl: {
        weergegevens: RawWeatherData;
    };
}

//------------------------------------------------------------------------------------------------------------------------------------------
// Derived data
//------------------------------------------------------------------------------------------------------------------------------------------

export interface CurrentWeather {
    station: {
        code:      string;
        name:      string;
        latitude:  string;
        longitude: string;
        updated:   Date;
    };
    temperature: string;    // In °C
    humidity:    string;
    pressure:    string;    // In hPa
    wind: {
        dirText:    string; // Text, like 'WZW'
        dirDegrees: string; // In degrees
        speed:      string; // In bft
        gusts:      string; // In m/s
    };
    rain:       string;     // In mm/h
    visibility: string;     // In metres
    icon: {
        url:     string;    // Full image URL
        wiClass: string;    // One of the wi-* classes
        text:    string;    // In Dutch
    };
    message: string;
}

export interface WeatherDayForecast {
    date:            string; // Full date, eg 'zondag 17 april 2016'
    dow:             string; // Day of week
    probSun:         number; // Sun probability in percent
    probSnow:        number; // Snow probability in percent
    rain: {
        probability: number; // Probability in percent
        minAmount:   number; // Minimum amount in mm
        maxAmount:   number; // Maximum amount in mm
    };
    temperature: {
        highMax:     number; // In °C
        highMin:     number; // In °C
        lowMax:      number; // In °C
        lowMin:      number; // In °C
    };
    wind: {
        dirText:     string; // Text, like 'WZW'
        speed:       number; // In bft
    };
    icon: {
        url:         string;
        wiClass:     string;
    };
}
