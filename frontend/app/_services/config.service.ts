import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    get buienRadarStationId(): string {
        return environment.buienRadarStationId;
    }

    constructor() { }
}
