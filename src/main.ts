import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),
        provideHttpClient(),
        provideCharts(withDefaultRegisterables()),
    ]
})
    .catch(err => console.error(err));
