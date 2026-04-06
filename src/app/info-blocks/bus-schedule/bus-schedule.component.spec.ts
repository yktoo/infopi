import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BusScheduleComponent } from './bus-schedule.component';

describe('BusScheduleComponent', () => {

    let component: BusScheduleComponent;
    let fixture: ComponentFixture<BusScheduleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BusScheduleComponent],
            providers: [
                provideHttpClientTesting(),
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
