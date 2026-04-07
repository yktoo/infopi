import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpinnerDirective } from './spinner.directive';

@Component({
    template: '<div [appSpinner]="spinning()"></div>',
    imports: [SpinnerDirective],
})
class TestComponent {
    readonly spinning = signal(false);
}

describe('SpinnerDirective', () => {

    let fixture: ComponentFixture<TestComponent>;
    let de: DebugElement[];
    let div: HTMLDivElement;
    let comp: TestComponent;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            imports: [SpinnerDirective, TestComponent],
        })
            .createComponent(TestComponent);
        fixture.detectChanges();
        comp = fixture.componentInstance;

        // All elements with an attached directive
        de = fixture.debugElement.queryAll(By.directive(SpinnerDirective));

        // Fetch the native element
        div = de[0].nativeElement as HTMLDivElement;
    });

    it('has one element', () => {
        expect(de.length).toBe(1);
        expect(div).toBeTruthy();
    });

    it('is initially not spinning', () => {
        expect(div.classList.contains('spinning')).toBe(false);
    });

    it('starts spinner', () => {
        vi.useFakeTimers();

        // Enable spinning: no 'spinning' class just yet
        comp.spinning.set(true);
        fixture.detectChanges();
        expect(div.classList.contains('spinning')).toBe(false);

        // The class gets assigned after 1000 ms
        vi.advanceTimersByTime(1001);
        fixture.detectChanges();
        expect(div.classList.contains('spinning')).toBe(true);

        // Disable spinning: the class disappears immediately
        comp.spinning.set(false);
        fixture.detectChanges();
        expect(div.classList.contains('spinning')).toBe(false);

        vi.useRealTimers();
    });
});
