import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WasteScheduleComponent } from './waste-schedule.component';

describe('WasteScheduleComponent', () => {

    let component: WasteScheduleComponent;
    let fixture: ComponentFixture<WasteScheduleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WasteScheduleComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(WasteScheduleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
