import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { WeatherComponent } from './weather/weather.component';
import { TrainComponent } from './train/train.component';
import { BusComponent } from './bus/bus.component';
import { FxComponent } from './fx/fx.component';
import { DomoticsComponent } from './domotics/domotics.component';
import { NewsComponent } from './news/news.component';
import { ChartComponent } from './chart/chart.component';
import { SpinnerDirective } from './_directives/spinner.directive';
import { TimeAgoPipe } from './_pipes/time-ago.pipe';

@NgModule({
    declarations: [
        AppComponent,
        ClockComponent,
        WeatherComponent,
        TrainComponent,
        BusComponent,
        FxComponent,
        DomoticsComponent,
        NewsComponent,
        ChartComponent,
        SpinnerDirective,
        TimeAgoPipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgChartsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
