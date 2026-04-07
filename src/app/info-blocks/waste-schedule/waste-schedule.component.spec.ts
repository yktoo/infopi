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
        fixture.componentRef.setInput('config', {
            enabled: true,
            refreshRate: 1000,
            apiKey: 'secret',
            postalCode: '1234AA',
            houseNumber: '12',
            houseNumberAddition: '',
            maxCount: 6,
        });
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
