import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpinnerDirective } from './spinner.directive';

@Component({
    template: '<div [appSpinner]="value"></div>',
    imports: [SpinnerDirective],
})
class TestComponent {
    value = false;
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
        expect(div).not.toHaveClass('spinning');
    });

    it('starts spinner', fakeAsync(() => {
        // Enable spinning: no 'spinning' class just yet
        comp.value = true;
        fixture.detectChanges();
        expect(div).not.toHaveClass('spinning');

        // The class gets assigned after 1000 ms
        tick(1001);
        fixture.detectChanges();
        expect(div).toHaveClass('spinning');

        // Disable spinning: the class disappears immediately
        comp.value = false;
        fixture.detectChanges();
        expect(div).not.toHaveClass('spinning');
    }));
});
