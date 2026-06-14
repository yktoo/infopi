import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpinnerDirective } from './spinner.directive';

@Component({
    template: '<div [appSpinner]="spinning()"></div>',
    imports: [SpinnerDirective],
})
class TestComponent {
    readonly spinning = input(false);
}

describe('SpinnerDirective', () => {

    let fixture: ComponentFixture<TestComponent>;
    let de: DebugElement[];
    let directive: SpinnerDirective;
    let div: HTMLDivElement;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            imports: [SpinnerDirective, TestComponent],
        })
            .createComponent(TestComponent);
        fixture.detectChanges();

        // All elements with an attached directive
        de = fixture.debugElement.queryAll(By.directive(SpinnerDirective));

        // Fetch the native element and the directive
        div = de[0].nativeElement as HTMLDivElement;
        directive = de[0].injector.get(SpinnerDirective);
    });

    it('has one element', () => {
        expect(de.length).toBe(1);
        expect(div).toBeTruthy();
    });

    it('is initially not spinning', () => {
        expect(directive.isSpinning.value()).toBe(false);
        expect(div.classList.contains('spinning')).toBe(false);
    });

    it('starts spinner', async () => {
        vi.useFakeTimers();

        // Enable spinning
        fixture.componentRef.setInput('spinning', true);
        fixture.detectChanges();

        // Verify the directive's input
        expect(directive.appSpinner()).toBe(true);

        // No isSpinning and no 'spinning' class just yet
        expect(directive.isSpinning.value()).toBe(false);
        expect(div.classList.contains('spinning')).toBe(false);

        // isSpinning becomes true and the 'spinning' class gets assigned after 1000 ms
        await vi.advanceTimersByTimeAsync(1000);
        fixture.detectChanges();
        expect(directive.isSpinning.value()).toBe(true);
        expect(div.classList.contains('spinning')).toBe(true);

        // Disable spinning
        fixture.componentRef.setInput('spinning', false);
        fixture.detectChanges();

        // Verify the directive's input
        expect(directive.appSpinner()).toBe(false);

        // The 'spinning' class disappears immediately (after a 0 timeout)
        await vi.advanceTimersByTimeAsync(0);
        fixture.detectChanges();

        expect(div.classList.contains('spinning')).toBe(false);

        vi.useRealTimers();
    });
});
