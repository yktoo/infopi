import { TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { WeatherComponent } from './weather/weather.component';
import { TrainComponent } from './train/train.component';
import { BusComponent } from './bus/bus.component';
import { NewsComponent } from './news/news.component';
import { ChartComponent } from './chart/chart.component';
import { FxComponent } from './fx/fx.component';
import { DomoticsComponent } from './domotics/domotics.component';

describe('AppComponent', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                MockComponent(ClockComponent),
                MockComponent(WeatherComponent),
                MockComponent(TrainComponent),
                MockComponent(BusComponent),
                MockComponent(NewsComponent),
                MockComponent(ChartComponent),
                MockComponent(FxComponent),
                MockComponent(DomoticsComponent),
            ],
        })
        .compileComponents();
    });

    it('creates the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`has correct title`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('InfoPi');
    });

    it('renders the app section', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('section#app')).toBeTruthy();
    });
});
