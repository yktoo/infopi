import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { XmlParserService } from './xml-parser.service';
import { RawRssChannel, RawRssFeed } from '../_models/rss-data';

@Injectable({
    providedIn: 'root',
})
export class RssService {

    constructor(
        private readonly http: HttpClient,
        private readonly cfgSvc: ConfigService,
        private readonly xmlParser: XmlParserService,
    ) {}

    /**
     * Request RSS items and return them wrapped in an Observable.
     */
    getRssItems(url: string): Observable<RawRssChannel> {
        return this.http.get(this.cfgSvc.corsProxy + url, {responseType: 'text'})
            .pipe(
                // Parse the XML response
                map(d => this.xmlParser.parse<RawRssFeed>(d)),
                // Unwrap the top level
                map(d => d.rss.channel));
    }
}
