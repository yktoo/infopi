import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RawWeather, RawWeatherData } from '../_models/weather-data';
import { XmlParserService } from './xml-parser.service';

@Injectable({
    providedIn: 'root'
})
export class BuienradarService {

    private fullMoonTime = new Date('1999-08-11 13:09').getTime();

    private iconToWiClassMap: { [k: string]: string } = {
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

    private moonPhaseMap = [
        {text: 'New',             wicls: 'wi-moon-new'},
        {text: 'Waxing crescent', wicls: 'wi-moon-waxing-crescent-1'},
        {text: 'Waxing crescent', wicls: 'wi-moon-waxing-crescent-2'},
        {text: 'Waxing crescent', wicls: 'wi-moon-waxing-crescent-3'},
        {text: 'Waxing crescent', wicls: 'wi-moon-waxing-crescent-4'},
        {text: 'Waxing crescent', wicls: 'wi-moon-waxing-crescent-5'},
        {text: 'Waxing crescent', wicls: 'wi-moon-waxing-crescent-6'},
        {text: 'First quarter',   wicls: 'wi-moon-first-quarter'},
        {text: 'Waxing gibbous',  wicls: 'wi-moon-waxing-gibbous-1'},
        {text: 'Waxing gibbous',  wicls: 'wi-moon-waxing-gibbous-2'},
        {text: 'Waxing gibbous',  wicls: 'wi-moon-waxing-gibbous-3'},
        {text: 'Waxing gibbous',  wicls: 'wi-moon-waxing-gibbous-4'},
        {text: 'Waxing gibbous',  wicls: 'wi-moon-waxing-gibbous-5'},
        {text: 'Waxing gibbous',  wicls: 'wi-moon-waxing-gibbous-6'},
        {text: 'Full',            wicls: 'wi-moon-full'},
        {text: 'Waning gibbous',  wicls: 'wi-moon-waning-gibbous-1'},
        {text: 'Waning gibbous',  wicls: 'wi-moon-waning-gibbous-2'},
        {text: 'Waning gibbous',  wicls: 'wi-moon-waning-gibbous-3'},
        {text: 'Waning gibbous',  wicls: 'wi-moon-waning-gibbous-4'},
        {text: 'Waning gibbous',  wicls: 'wi-moon-waning-gibbous-5'},
        {text: 'Waning gibbous',  wicls: 'wi-moon-waning-gibbous-6'},
        {text: 'Third quarter',   wicls: 'wi-moon-third-quarter'},
        {text: 'Waning crescent', wicls: 'wi-moon-waning-crescent-1'},
        {text: 'Waning crescent', wicls: 'wi-moon-waning-crescent-2'},
        {text: 'Waning crescent', wicls: 'wi-moon-waning-crescent-3'},
        {text: 'Waning crescent', wicls: 'wi-moon-waning-crescent-4'},
        {text: 'Waning crescent', wicls: 'wi-moon-waning-crescent-5'},
        {text: 'Waning crescent', wicls: 'wi-moon-waning-crescent-6'},
    ];


    constructor(
        private readonly http: HttpClient,
        private readonly domSanitizer: DomSanitizer,
        private readonly xmlParser: XmlParserService,
    ) {}

    getWeather(): Observable<RawWeatherData> {
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
        return this.iconToWiClassMap[buienradarIconId] || 'wi-na';
    }

    getRadarMapUrl(): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(
            'https://gadgets.buienradar.nl/gadget/zoommap/' +
                '?lat=52.02833&lng=5.16806' +
                '&overname=2' +
                '&zoom=8' +
                '&size=3' +
                '&voor=1' +
                '&random=' + Math.random());
    }

    /**
     * Calculate the current moon phase and return it as an object.
     */
    getMoonPhase(): any {
        const diffDays = (new Date().getTime() - this.fullMoonTime) / 86400000;
        const phase = Math.round((diffDays / 29.530588853) % 1 * 27);
        return {
            phase,
            text:  this.moonPhaseMap[phase].text,
            wicls: this.moonPhaseMap[phase].wicls,
        };
    }

}
