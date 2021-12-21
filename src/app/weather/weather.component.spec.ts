import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { WeatherComponent } from './weather.component';
import { SpinnerDirective } from '../_directives/spinner.directive';
import { BuienradarService } from '../_services/buienradar.service';

describe('WeatherComponent', () => {

    let component: WeatherComponent;
    let fixture: ComponentFixture<WeatherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WeatherComponent, SpinnerDirective],
            providers: [
                {provide: BuienradarService, useValue: MockService(BuienradarService)},
            ],
        })
        .compileComponents();

        fixture = TestBed.createComponent(WeatherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
