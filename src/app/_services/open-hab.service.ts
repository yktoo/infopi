import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OpenHabService {

    constructor(private http: HttpClient, private cfgSvc: ConfigService) { }

    /**
     * Request items from the OpenHAB server and return them wrapped in an Observable.
     * @param item Regular or group item to request.
     */
    getItems(item: string): Observable<any[]> {
        return this.http.get(this.cfgSvc.configuration.domotics.openHabServerUrl + '/rest/items/' + item)
            // Unwrap the top layer
            .pipe(map((data: any) => data.members));
    }

}
