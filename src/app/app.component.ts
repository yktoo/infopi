import { Component, inject } from '@angular/core';
import { NewsComponent } from './info-blocks/news/news.component';
import { HomeAutomationComponent } from './info-blocks/home-automation/home-automation.component';
import { ClockComponent } from './info-blocks/clock/clock.component';
import { WeatherComponent } from './info-blocks/weather/weather.component';
import { TrainScheduleComponent } from './info-blocks/train-schedule/train-schedule.component';
import { APP_CONFIG } from './core/config/config';
import { WasteScheduleComponent } from './info-blocks/waste-schedule/waste-schedule.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        NewsComponent,
        HomeAutomationComponent,
        ClockComponent,
        WeatherComponent,
        TrainScheduleComponent,
        WasteScheduleComponent,
    ],
})
export class AppComponent {

    readonly config = inject(APP_CONFIG);
}
