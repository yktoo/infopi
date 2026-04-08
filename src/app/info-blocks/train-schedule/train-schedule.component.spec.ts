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
        fixture.componentRef.setInput('config', {
            enabled: true,
            refreshRate: 1000,
            nsApiKey: 'secret',
            departureStationName: 'Utrecht',
            departureStationCode: 'ut',
            maxDepartureCount: 10,
        });
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
