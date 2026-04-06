import { Component, effect, input, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ClockConfig } from '../../core/config/config';

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss'],
    imports: [
        DatePipe,
    ],
})
export class ClockComponent {

    /** Component configuration. */
    readonly config = input.required<ClockConfig>();

    /** The current time. */
    readonly now = signal(new Date());

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.update());
            onCleanup(() => t.unsubscribe());
        });
    }

    /**
     * Update the displayed content.
     */
    update() {
        this.now.set(new Date());
    }
}
