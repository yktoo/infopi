import { Component, effect, inject, input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AstroData, CurrentWeather, RawWeather, RawWeatherData, WeatherDayForecast } from './models';
import { DataLoading, loadsDataInto } from '../../core/data-loading';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { XmlParserService } from '../../core/xml-parser/xml-parser.service';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { RadarMapComponent } from './radar-map/radar-map.component';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';
import { WeatherConfig } from '../../core/config/config';

@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    imports: [
        SpinnerDirective,
        CurrentWeatherComponent,
        RadarMapComponent,
        WeatherForecastComponent,
    ],
})
export class WeatherComponent implements DataLoading {

    private static readonly fullMoonTime = new Date('1999-08-11 13:09').getTime();

    private static readonly iconToWiClassMap: Record<string, string> = {
        // Day
        a: 'wi-day-sunny',
        b: 'wi-day-sunny-overcast',
        c: 'wi-cloud',
        d: 'wi-day-cloudy-windy',
        e: 'wi-day-fog',
        f: 'wi-day-sprinkle',
        g: 'wi-day-thunderstorm',
        h: 'wi-day-rain',
        i: 'wi-day-rain',
        j: 'wi-day-sunny-overcast',
        k: 'wi-day-showers',
        l: 'wi-day-sleet',
        m: 'wi-sleet',
        n: 'wi-snowflake-cold',
        o: 'wi-day-cloudy',
        p: 'wi-cloud',
        q: 'wi-sleet',
        r: 'wi-day-cloudy',
        s: 'wi-day-sleet-storm',
        t: 'wi-snow',
        u: 'wi-day-snow',
        v: 'wi-sleet',
        w: 'wi-rain-mix',
        x: 'wi-snow',
        y: 'wi-snow-wind',
        z: 'wi-snow-wind',
        // Night
        aa: 'wi-night-clear',
        bb: 'wi-night-partly-cloudy',
        cc: 'wi-night-cloudy',
        dd: 'wi-night-alt-cloudy-windy',
        ee: 'wi-night-fog',
        ff: 'wi-night-sprinkle',
        gg: 'wi-night-alt-thunderstorm',
        hh: 'wi-night-rain',
        ii: 'wi-night-alt-rain',
        jj: 'wi-night-alt-cloudy',
        kk: 'wi-night-alt-showers',
        ll: 'wi-night-alt-sleet',
        mm: 'wi-sleet',
        nn: 'wi-snowflake-cold',
        oo: 'wi-night-cloudy',
        pp: 'wi-cloud',
        qq: 'wi-sleet',
        rr: 'wi-night-alt-cloudy',
        ss: 'wi-night-alt-sleet-storm',
        tt: 'wi-snow',
        uu: 'wi-night-alt-snow',
        vv: 'wi-sleet',
        ww: 'wi-rain-mix',
        xx: 'wi-snow',
        yy: 'wi-snow-wind',
        zz: 'wi-snow-wind',
    };

    private readonly http = inject(HttpClient);
    private readonly xmlParser = inject(XmlParserService);

    /** Component configuration. */
    readonly config = input.required<WeatherConfig>();

    /** Current weather conditions. */
    readonly currentWeather = signal<CurrentWeather | undefined>(undefined);

    /** Current astronomic conditions. */
    readonly astro = signal<AstroData | undefined>(undefined);

    /** URL of the radar map. */
    readonly radarMapUrl = signal<string | undefined>(undefined);

    /** Weather forecasts for the upcoming days. */
    readonly dayForecasts = signal<WeatherDayForecast[] | undefined>(undefined);

    error: any;
    dataLoading = false;

    /**
     * Convert Buienradar's datetime of the format 'mm/dd/yyyy hh:mm:ss' into the ISO 8601 format.
     */
    private static convertDate(s: string): Date {
        return new Date(s.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)\s+([\d:]+)/, '$3-$1-$2T$4'));
    }

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.update());
            onCleanup(() => t.unsubscribe());
        });
    }

    update() {
        this.getWeather()
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });

        // Update the current radar map URL to reload the image
        this.radarMapUrl.set(
            'https://gadgets.buienradar.nl/gadget/zoommap/' +
            '?lat=52.02833&lng=5.16806' +
            '&overname=2' +
            '&zoom=8' +
            '&size=3' +
            '&voor=1' +
            '&random=' + Math.random());
    }

    private getWeather(): Observable<RawWeatherData> {
        return this.http.get('https://data.buienradar.nl/1.0/feed/xml', {responseType: 'text'})
            .pipe(
                // Parse the XML response from Buienradar
                map(d => this.xmlParser.parse<RawWeather>(d)),
                // Unwrap the top two levels
                map(res => res.buienradarnl.weergegevens));

    }

    /**
     * Return the name of a WeatherIcons class for the given Buienradar icon ID.
     * @param buienradarIconId Name of Buienradar icon ID.
     */
    getWeatherIconClass(buienradarIconId: string): string {
        return WeatherComponent.iconToWiClassMap[buienradarIconId] || 'wi-na';
    }

    /**
     * Calculate the current moon phase and return it as a number in the range 0..27.
     */
    private getMoonPhase(): number {
        const diffDays = (new Date().getTime() - WeatherComponent.fullMoonTime) / 86400000;
        return Math.round((diffDays / 29.530588853) % 1 * 27);
    }

    private processData(data: RawWeatherData) {
        // Remove any error
        this.error = undefined;

        // Find the desired weather station by its ID
        const curWeather = data.actueel_weer;

        // Prepare the current weather
        const id = this.config().buienRadarStationId;
        const station = curWeather.weerstations.weerstation.find(e => e.attr.id === id);
        if (station) {
            const icon = station.icoonactueel;
            this.currentWeather.set({
                station: {
                    code:       station.stationcode.text,
                    name:       station.stationnaam.text,
                    latitude:   station.lat.text,
                    longitude:  station.lon.text,
                    updated:    WeatherComponent.convertDate(station.datum.text),
                },
                temperature:    station.temperatuurGC.text,
                humidity:       station.luchtvochtigheid.text,
                pressure:       station.luchtdruk.text,
                wind: {
                    dirText:    station.windrichting.text,
                    dirDegrees: station.windrichtingGR.text,
                    speed:      station.windsnelheidBF.text,
                    gusts:      station.windstotenMS.text
                },
                rain:           station.regenMMPU.text,
                visibility:     station.zichtmeters.text,
                icon: {
                    url:        icon.text,
                    wiClass:    this.getWeatherIconClass(icon.attr.ID),
                    text:       icon.attr.zin ?? '',
                },
                message:        data.verwachting_vandaag.samenvatting.text,
            });
        } else {
            this.currentWeather.set(undefined);
        }

        // Prepare weather forecast
        const weekdayMap = {ma: 'Mon', di: 'Tue', wo: 'Wed', do: 'Thu', vr: 'Fri', za: 'Sat', zo: 'Sun'};
        this.dayForecasts.set([1, 2, 3, 4, 5]
            .map(i => data.verwachting_meerdaags[`dag-plus${i}` as 'dag-plus1'])
            .map(dw => ({
                date:            dw.datum.text,               // Full date, eg 'zondag 17 april 2016'
                dow:             weekdayMap[dw.dagweek.text as keyof typeof weekdayMap],
                probSun:         Number(dw.kanszon.text),     // Probability in percent
                probSnow:        Number(dw.sneeuwcms.text),   // Probability in percent
                rain: {
                    probability: Number(dw.kansregen.text),   // Probability in percent
                    minAmount:   Number(dw.minmmregen.text),  // Minimum amount in mm
                    maxAmount:   Number(dw.maxmmregen.text),  // Maximum amount in mm
                },
                temperature: {
                    highMax:     Number(dw.maxtempmax.text),  // In °C
                    highMin:     Number(dw.maxtemp.text),     // In °C
                    lowMax:      Number(dw.mintempmax.text),  // In °C
                    lowMin:      Number(dw.mintemp.text),     // In °C
                },
                wind: {
                    dirText:     dw.windrichting.text,        // Text, like 'WZW'
                    speed:       Number(dw.windkracht.text),  // In bft
                },
                icon: {
                    url:         dw.icoon.text,
                    wiClass:     this.getWeatherIconClass(dw.icoon.attr.ID),
                },
            })));

        // Update the sunrise, sunset and moon phase
        this.astro.set({
            sunrise:   WeatherComponent.convertDate(curWeather.buienradar.zonopkomst.text),
            sunset:    WeatherComponent.convertDate(curWeather.buienradar.zononder.text),
            moonPhase: this.getMoonPhase(),
        });
    }
}
