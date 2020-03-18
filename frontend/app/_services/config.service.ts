import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    refreshRate(key: string): number {
        return environment.refreshRates[key];
    }

    get buienRadarStationId(): string {
        return environment.buienRadarStationId;
    }

    constructor() { }
}
