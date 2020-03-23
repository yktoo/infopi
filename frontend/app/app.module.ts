import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { WeatherComponent } from './weather/weather.component';
import { HttpClientModule } from '@angular/common/http';
import { TrainComponent } from './train/train.component';
import { BusComponent } from './bus/bus.component';
import { FxComponent } from './fx/fx.component';

@NgModule({
    declarations: [
        AppComponent,
        ClockComponent,
        WeatherComponent,
        TrainComponent,
        BusComponent,
        FxComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
