import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherForecastComponent } from './weather-forecast.component';

describe('WeatherForecastComponent', () => {

    let component: WeatherForecastComponent;
    let fixture: ComponentFixture<WeatherForecastComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WeatherForecastComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(WeatherForecastComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('dayForecasts', []);
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
