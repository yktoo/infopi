import { Component } from '@angular/core';
import { NewsComponent } from './news/news.component';
import { DomoticsComponent } from './domotics/domotics.component';
import { ClockComponent } from './clock/clock.component';
import { WeatherComponent } from './weather/weather.component';
import { TrainComponent } from './train/train.component';
import { BusComponent } from './bus/bus.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        NewsComponent,
        DomoticsComponent,
        ClockComponent,
        WeatherComponent,
        TrainComponent,
        BusComponent,
    ],
})
export class AppComponent {
    title = 'InfoPi';
}
