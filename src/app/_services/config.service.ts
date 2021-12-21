import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    get configuration(): any {
        return environment.configuration;
    }

    get corsProxy(): string {
        return environment.corsProxy;
    }
}
