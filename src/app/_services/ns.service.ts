import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';
import { TrainDeparture } from '../_models/train-departure';

@Injectable({
    providedIn: 'root'
})
export class NsService {

    private static baseUrl = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/';

    constructor(
        private readonly http: HttpClient,
        private readonly cfgSvc: ConfigService,
    ) {}

    /**
     * Request train departure times for the specified station and return them wrapped in an Observable.
     * @param station Station code to request departure times for.
     */
    getDepartureTimes(station: string): Observable<TrainDeparture[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.cfgSvc.configuration.api.nsApiKey
            }),
            params: {
                station,
                lang: 'en',
            }
        };
        return this.http.get<any>(this.cfgSvc.corsProxy + NsService.baseUrl + 'departures', httpOptions)
            // Unwrap the top level
            .pipe(map(res => res.payload.departures));
    }

}
