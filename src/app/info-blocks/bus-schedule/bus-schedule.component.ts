import { Component, computed, effect, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { BusScheduleConfig } from '../../core/config/config';

@Component({
    selector: 'app-bus',
    templateUrl: './bus-schedule.component.html',
    styleUrls: ['./bus-schedule.component.scss'],
    imports: [
        SpinnerDirective,
        DatePipe,
    ],
})
export class BusScheduleComponent {

    /** Component configuration. */
    readonly config = input.required<BusScheduleConfig>();

    /** Raw bus schedule data received from the API. */
    readonly bussesResource = httpResource<any>(() => `https://v0.ovapi.nl/stopareacode/${this.config().ovapiStopCode}`);

    /** Bus departures being displayed. */
    readonly departures = computed(() => {
        if (!this.bussesResource.hasValue()) {
            return undefined;
        }

        const dep = this.bussesResource.value()?.[this.config().ovapiStopCode];
        if (!dep) {
            return undefined;
        }

        return Object.values(dep)
            // Flatten passes
            .flatMap(stop => Object.values((stop as any).Passes))
            .map(pass => pass as any)
            // Calculate delays
            .map(pass => {
                const delay = Math.round((new Date(pass.TargetDepartureTime).getTime() - new Date(pass.ExpectedDepartureTime).getTime()) / 60_000);
                if (delay > 0) {
                    pass.delay = '+' + delay;
                }
                return pass;
            })
            // Sort passes by departure time
            .sort((a, b) => a.TargetDepartureTime < b.TargetDepartureTime ?
                -1 :
                (a.TargetDepartureTime === b.TargetDepartureTime ? 0 : 1),
            )
            // Limit the number of items
            .slice(0, this.config().maxDepartureCount);
    });

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.bussesResource.reload());
            onCleanup(() => t.unsubscribe());
        });
    }
}
