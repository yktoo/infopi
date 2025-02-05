import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { WeatherComponent } from './weather.component';
import { BuienradarService } from '../_services/buienradar.service';

describe('WeatherComponent', () => {

    let component: WeatherComponent;
    let fixture: ComponentFixture<WeatherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WeatherComponent],
            providers: [
                {provide: BuienradarService, useValue: MockService(BuienradarService)},
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
