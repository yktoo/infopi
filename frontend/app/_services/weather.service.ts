import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { parseStringPromise } from 'xml2js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    private iconToWiClassMap = {
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

    constructor(private http: HttpClient, private domSanitizer: DomSanitizer) { }

    getWeather(): Observable<any> {
        return this.http.get('https://data.buienradar.nl/1.0/feed/xml', { responseType: 'text'})
            // Parse the XML response from Buienradar
            .pipe(switchMap(res => parseStringPromise(res)))
            // Unwrap the top two levels
            .pipe(switchMap(res => res.buienradarnl.weergegevens));
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
        'http://gadgets.buienradar.nl/gadget/zoommap/' +
            '?lat=52.02833&lng=5.16806'+
            '&overname=2' +
            '&zoom=8' +
            '&size=3' +
            '&voor=1' +
            '&random=' + Math.random());
    }
}
