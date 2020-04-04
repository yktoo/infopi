import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { WeatherComponent } from './weather/weather.component';
import { TrainComponent } from './train/train.component';
import { BusComponent } from './bus/bus.component';
import { FxComponent } from './fx/fx.component';
import { DomoticsComponent } from './domotics/domotics.component';
import { NewsComponent } from './news/news.component';
import { IfChangesDirective } from './_directives/if-changes.directive';
import { ChartsModule } from 'ng2-charts';
import { PicComponent } from './pic/pic.component';

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
        IfChangesDirective,
        PicComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ChartsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
