import { Component, computed, effect, input, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { RadarMapComponent } from './radar-map/radar-map.component';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';
import { WeatherConfig } from '../../core/config/config';
import { AstroData, CurrentWeather, RawBuienradarWeatherResponse, WeatherDayForecast } from './models';

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
export class WeatherComponent {

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

    /** Component configuration. */
    readonly config = input.required<WeatherConfig>();

    /** Station ID to use. */
    readonly stationId = computed<number>(() => this.config().buienRadarStationId);

    /** Weather resource. */
    readonly weather = httpResource<RawBuienradarWeatherResponse>(() => 'https://data.buienradar.nl/2.0/feed/json');

    /** Current weather conditions. */
    readonly currentWeather = computed<CurrentWeather | undefined>(() => {
        if (!this.weather.hasValue()) {
            return undefined;
        }
        const weather = this.weather.value();

        // Find the station in question
        const stationId = this.stationId();
        const station = weather?.actual.stationmeasurements.find(sm => sm.stationid === stationId);
        if (!station) {
            return undefined;
        }

        return {
            station: {
                code:       station.stationid,
                name:       station.stationname,
                latitude:   station.lat,
                longitude:  station.lon,
                updated:    new Date(station.timestamp),
            },
            temperature:    station.temperature,
            humidity:       station.humidity,
            pressure:       station.airpressure,
            wind: {
                dirText:    station.winddirection,
                dirDegrees: station.winddirectiondegrees,
                speed:      station.windspeed,
                speedBft:   station.windspeedBft,
                gusts:      station.windgusts,
            },
            rain:           station.precipitation,
            visibility:     station.visibility,
            icon:           WeatherComponent.getWeatherIconClass(station.iconurl),
            description:    station.weatherdescription,
            message:        weather?.forecast.weatherreport.summary ?? '',
        };
    });

    /** Current astronomic conditions. */
    readonly astro = computed<AstroData | undefined>(() => this.weather.hasValue() ?
        {
            sunrise:   new Date(this.weather.value()?.actual.sunrise),
            sunset:    new Date(this.weather.value()?.actual.sunset),
            moonPhase: this.getMoonPhase(),
        } :
        undefined);

    /** Weather forecasts for the upcoming days. */
    readonly dayForecasts = computed<WeatherDayForecast[] | undefined>(() => this.weather.hasValue() ?
        this.weather.value()?.forecast.fivedayforecast.map(fc => ({
            date:            new Date(fc.day),
            probSun:         fc.sunChance,
            rain: {
                probability: fc.rainChance,
                minAmount:   fc.mmRainMin,
                maxAmount:   fc.mmRainMax,
            },
            temperature: {
                highMax:     fc.maxtemperatureMax,
                highMin:     fc.maxtemperatureMin,
                lowMax:      fc.mintemperatureMax,
                lowMin:      fc.mintemperatureMin,
            },
            wind: {
                dirText:     fc.windDirection,
                speedBft:    fc.wind,
            },
            icon:            WeatherComponent.getWeatherIconClass(fc.iconurl),
        })) :
        undefined);

    /** URL of the radar map. */
    readonly radarMapUrl = signal<string | undefined>(undefined);

    /**
     * Return the name of a WeatherIcons class for the given Buienradar icon URL.
     * @param iconUrl Buienradar icon URL.
     */
    private static getWeatherIconClass(iconUrl: string): string {
        // Extract name of the icon file (the last component of the URL), without the extension
        const fn = iconUrl.replace(/^.+\/(\w+)\.png$/, '$1');
        // Convert that name into an icon
        return this.iconToWiClassMap[fn] || 'wi-na';
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
        this.weather.reload();

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

    /**
     * Calculate the current moon phase and return it as a number in the range 0..27.
     */
    private getMoonPhase(): number {
        const diffDays = (new Date().getTime() - WeatherComponent.fullMoonTime) / 86400000;
        return Math.round((diffDays / 29.530588853) % 1 * 27);
    }
}
