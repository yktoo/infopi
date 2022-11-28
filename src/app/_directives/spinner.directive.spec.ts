import { SpinnerDirective } from './spinner.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
    template: '<div [appSpinner]="value"></div>',
})
class TestComponent {
    value = false;
}

describe('SpinnerDirective', () => {

    let fixture: ComponentFixture<TestComponent>;
    let de: DebugElement[];
    let div: HTMLDivElement;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [SpinnerDirective, TestComponent],
        })
            .createComponent(TestComponent);
        fixture.detectChanges();

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
        expect(div.classList).not.toContain('spinning');
    });

    it('starts spinner', fakeAsync(() => {
        // Enable spinning
        fixture.componentInstance.value = true;
        fixture.detectChanges();

        // No class is assigned yet
        expect(div.classList).not.toContain('spinning');

        // The class gets assigned after 1000 ms
        tick(1001);
        expect(div.classList).toContain('spinning');

        // Disable spinning
        fixture.componentInstance.value = false;
        fixture.detectChanges();

        // The class disappears immediately
        expect(div.classList).not.toContain('spinning');
    }));
});
