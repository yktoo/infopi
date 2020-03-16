import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { parseStringPromise } from 'xml2js';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    constructor(private http: HttpClient) { }

    getWeather(): Observable<any> {
        return this.http.get('https://data.buienradar.nl/1.0/feed/xml', { responseType: 'text'})
            // Parse the XML response from Buienradar
            .pipe(switchMap(res => parseStringPromise(res)))
            // Unwrap the top two levels
            .pipe(switchMap(res => res.buienradarnl.weergegevens));
    }
}
