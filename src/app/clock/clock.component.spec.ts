import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClockComponent } from './clock.component';

describe('ClockComponent', () => {
    let component: ClockComponent;
    let fixture: ComponentFixture<ClockComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ ClockComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        jasmine.clock().mockDate(new Date('2006-05-04 23:01:59'));
        fixture = TestBed.createComponent(ClockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display date', () => {
        const element: HTMLElement = fixture.nativeElement;
        expect(element.querySelector('.date').textContent).toEqual('4.05');
        expect(element.querySelector('.day-of-week').textContent).toEqual('Thursday');
    });

    it('should display time', () => {
        const element: HTMLElement = fixture.nativeElement;
        expect(element.querySelector('.hhmm').textContent).toEqual('23:01');
        expect(element.querySelector('.ss').textContent).toEqual(':59');
    });

    it('#update() should update time', () => {
        // Check initial date/time
        expect(component.now).toEqual(new Date('2006-05-04 23:01:59'));

        // Change and update the date/time
        jasmine.clock().mockDate(new Date('2006-05-04 23:03:02'));
        component.update();

        // Check the updated date/time
        expect(component.now).toEqual(new Date('2006-05-04 23:03:02'));
    });

    it('should be hidden if there is no time value', () => {
        const element: HTMLElement = fixture.nativeElement;
        expect(element.querySelector('.clock')).toBeTruthy();

        component.now = undefined;
        fixture.detectChanges();
        expect(element.querySelector('.clock')).toBeFalsy();
    });

});
