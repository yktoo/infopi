import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { InfoPiConfig } from '../_models/info-pi-config';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    get configuration(): InfoPiConfig {
        return environment.configuration;
    }

    get corsProxy(): string {
        return environment.corsProxy;
    }
}
