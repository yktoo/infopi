import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClockComponent } from './clock.component';

describe('ClockComponent', () => {

    let component: ClockComponent;
    let fixture: ComponentFixture<ClockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ClockComponent],
        })
            .compileComponents();

        jasmine.clock().mockDate(new Date('2006-05-04 23:01:59'));
        fixture = TestBed.createComponent(ClockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });

    it('displays date', () => {
        const element: HTMLElement = fixture.nativeElement;
        expect(element.querySelector('.date').textContent).toEqual('4.05');
        expect(element.querySelector('.day-of-week').textContent).toEqual('Thursday');
    });

    it('displays time', () => {
        const element: HTMLElement = fixture.nativeElement;
        expect(element.querySelector('.hhmm').textContent).toEqual('23:01');
        expect(element.querySelector('.ss').textContent).toEqual(':59');
    });

    it('updates time', () => {
        // Check initial date/time
        expect(component.now).toEqual(new Date('2006-05-04 23:01:59'));

        // Change and update the date/time
        jasmine.clock().mockDate(new Date('2006-05-04 23:03:02'));
        component.update();

        // Check the updated date/time
        expect(component.now).toEqual(new Date('2006-05-04 23:03:02'));
    });
});
