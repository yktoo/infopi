import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { parseStringPromise } from 'xml2js';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class RssService {

    constructor(private http: HttpClient, private cfgSvc: ConfigService) { }

    /**
     * Request RSS items and return them wrapped in an Observable.
     */
    getRssItems(url: string): Observable<any> {
        return this.http.get(this.cfgSvc.corsProxy + url, {responseType: 'text'})
            // Parse the XML response
            .pipe(switchMap(res => parseStringPromise(res)))
            // Unwrap the top level
            .pipe(map(res => res.feed || res.rss.channel[0]));
    }

}
