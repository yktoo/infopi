import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { WeatherComponent } from './weather.component';

describe('WeatherComponent', () => {

    let component: WeatherComponent;
    let fixture: ComponentFixture<WeatherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WeatherComponent],
            providers: [
                provideHttpClientTesting(),
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(WeatherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
