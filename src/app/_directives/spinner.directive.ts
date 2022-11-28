import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appSpinner]',
})
export class SpinnerDirective implements OnChanges {

    /** Whether the spinning animation is shown on the component. */
    @Input() appSpinner = false;

    private _timer: any;

    constructor(
        private element: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        // Update the spinning state
        if (changes.appSpinner) {
            // Enable spinner after a short while to reduce flickering
            if (this.appSpinner) {
                this.cancelTimer();
                this._timer = setTimeout(() => this.setSpinning(true), 1000);

            // Disable the spinner immediately
            } else {
                this.setSpinning(false);
            }
        }
    }

    /**
     * Remove the delay timer, if any.
     */
    private cancelTimer() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    private setSpinning(value: boolean) {
        // Remove the delay timer, if any
        this.cancelTimer();

        // Add or remove the spinning class
        const ne = this.element.nativeElement;
        if (value) {
            this.renderer.addClass(ne, 'spinning');
        } else {
            this.renderer.removeClass(ne, 'spinning');
        }
    }

}
