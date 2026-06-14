import { debounced, Directive, input } from '@angular/core';

@Directive({
    selector: '[appSpinner]',
    host: {
        '[class.spinning]': 'isSpinning.value()',
    },
})
export class SpinnerDirective {

    /** Whether the spinning animation is shown on the component. */
    readonly appSpinner = input(false);

    /** Whether the spinner is to be shown: gets set to true with a delay, or to false immediately whenever appSpinner changes. */
    readonly isSpinning = debounced(this.appSpinner, b => new Promise<void>(r => setTimeout(r, b ? 1000 : 0)));
}
