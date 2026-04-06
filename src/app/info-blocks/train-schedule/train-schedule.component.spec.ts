import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TrainScheduleComponent } from './train-schedule.component';

describe('TrainScheduleComponent', () => {

    let component: TrainScheduleComponent;
    let fixture: ComponentFixture<TrainScheduleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TrainScheduleComponent],
            providers: [
                provideHttpClientTesting(),
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
