import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OvApiService {

    private static baseUrl = 'http://v0.ovapi.nl/stopareacode/';

    constructor(private http: HttpClient) { }

    /**
     * Request bus departure times for the specified stop and return them wrapped in an Observable.
     * @param stopCode Bus stop code to request departure times for.
     */
    getDepartureTimes(stopCode: string): Observable<any> {
        return this.http.get(OvApiService.baseUrl + stopCode).pipe(map(data => data[stopCode]));
    }

}
