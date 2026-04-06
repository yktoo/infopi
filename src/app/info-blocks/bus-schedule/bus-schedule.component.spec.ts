import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { BusScheduleComponent } from './bus-schedule.component';
import { OvApiService } from '../_services/ov-api.service';

describe('BusScheduleComponent', () => {

    let component: BusScheduleComponent;
    let fixture: ComponentFixture<BusScheduleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BusScheduleComponent],
            providers: [
                {provide: OvApiService, useValue: MockService(OvApiService)},
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(BusScheduleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
