import { Directive, Input } from '@angular/core';
import { BehaviorSubject, of, switchMap, timer } from 'rxjs';

@Directive({
    selector: '[appSpinner]',
    host: {
        '[class.spinning]': 'isSpinning',
    },
})
export class SpinnerDirective {

    isSpinning = false;

    private readonly spinning$ = new BehaviorSubject<boolean>(false);

    constructor() {
        // Set isSpinning to true with a delay, or to false immediately
        this.spinning$.pipe(switchMap(b => b ? timer(1000) : of(1))).subscribe(n => this.isSpinning = n === 0);
    }

    /** Whether the spinning animation is shown on the component. */
    @Input()
    set appSpinner(b: boolean) {
        this.spinning$.next(b);
    }
}
