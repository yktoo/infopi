import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface OpenHabItem {
    members?:    OpenHabItem[];
    link:        string;
    state?:      string;
    editable?:   boolean;
    type:        string;
    category?:   string;
    name:        string;
    label?:      string;
    tags?:       string[];
    groupNames?: string[];
}

@Injectable({
    providedIn: 'root',
})
export class OpenHabService {

    private readonly baseUrl = `${this.cfgSvc.configuration.domotics.openHabServerUrl}/rest/items/`;

    constructor(
        private readonly http: HttpClient,
        private readonly cfgSvc: ConfigService,
    ) {}

    /**
     * Request items from the OpenHAB server and return them wrapped in an Observable.
     * @param item Regular or group item to request.
     */
    getItems(item: string): Observable<OpenHabItem[]> {
        return this.http.get<OpenHabItem>(this.baseUrl + item).pipe(map(data => data.members));
    }
}
