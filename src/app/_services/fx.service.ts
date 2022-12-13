import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { XmlParserService } from './xml-parser.service';

interface FxBasic {
    'gesmes:Envelope': any;
}

@Injectable({
    providedIn: 'root'
})
export class FxService {

    private static baseUrl = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';

    constructor(
        private readonly http: HttpClient,
        private readonly cfgSvc: ConfigService,
        private readonly xmlParser: XmlParserService,
    ) {}

    /**
     * Request FX rates and return them wrapped in an Observable.
     */
    getFxRates(): Observable<any> {
        return this.http.get(this.cfgSvc.corsProxy + FxService.baseUrl, {responseType: 'text'})
            .pipe(
                // Parse the XML response
                map(d => this.xmlParser.parse<FxBasic>(d)),
                // Unwrap the top level
                map(res => res['gesmes:Envelope']));
    }
}
