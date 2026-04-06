import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { TrainScheduleComponent } from './train-schedule.component';
import { NsService } from '../_services/ns.service';

describe('TrainScheduleComponent', () => {

    let component: TrainScheduleComponent;
    let fixture: ComponentFixture<TrainScheduleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TrainScheduleComponent],
            providers: [
                {provide: NsService, useValue: MockService(NsService)},
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(TrainScheduleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
