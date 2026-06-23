import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppComponent } from './app/app.component';
import Annotation from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),
        provideHttpClient(),
        provideCharts(withDefaultRegisterables(Annotation, ChartDataLabels)),
    ]
})
    .catch(err => console.error(err));
