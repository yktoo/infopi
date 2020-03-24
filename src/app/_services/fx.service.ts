import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { map, switchMap } from 'rxjs/operators';
import { parseStringPromise } from 'xml2js';

@Injectable({
    providedIn: 'root'
})
export class FxService {

    private static baseUrl = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';

    constructor(private http: HttpClient, private config: ConfigService) { }

    /**
     * Request train departure times for the specified station and return them wrapped in an Observable.
     */
    getFxRates(): Observable<any> {
        return this.http.get(this.config.corsProxy + FxService.baseUrl, {responseType: 'text'})
            // Parse the XML response
            .pipe(switchMap(res => parseStringPromise(res)))
            // Unwrap the top level
            .pipe(map(res => res['gesmes:Envelope']));
    }


}
