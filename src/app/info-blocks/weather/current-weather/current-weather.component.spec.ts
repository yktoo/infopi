import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentWeatherComponent } from './current-weather.component';

describe('CurrentWeatherComponent', () => {

    let component: CurrentWeatherComponent;
    let fixture: ComponentFixture<CurrentWeatherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CurrentWeatherComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(CurrentWeatherComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('weather', {
            station: {code: '2506', name: 'Rivendell', latitude: '1.2345', longitude: '5.4321', updated: new Date()},
            temperature: '6',
            humidity: '7',
            pressure: '25',
            wind: {dirText: 'WZW', dirDegrees: '212', speed: '4', gusts: '25'},
            rain: 'string',
            visibility: 'string',
            icon: {url: 'whatever', wiClass: 'wi-foo', text: 'Foo'},
            message: 'string',
        });
        fixture.componentRef.setInput('astro', {
            sunrise: new Date(),
            sunset: new Date(),
            moonPhase: 1,
        });
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
