import { Component, inject, signal } from '@angular/core';
import { timer } from 'rxjs';
import { DatePipe } from '@angular/common';
import { APP_CONFIG } from '../../core/config/config';

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss'],
    imports: [
        DatePipe,
    ],
})
export class ClockComponent {

    readonly now = signal(new Date());

    private readonly refreshRate = inject(APP_CONFIG).clock.refreshRate;

    constructor() {
        timer(0, this.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.now.set(new Date());
    }
}
