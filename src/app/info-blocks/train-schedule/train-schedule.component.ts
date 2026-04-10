import { Component, effect, input } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { TrainScheduleConfig } from '../../core/config/config';
import { RawNsApiDepartureResponse, TrainDeparture } from './models';

@Component({
    selector: 'app-train',
    templateUrl: './train-schedule.component.html',
    styleUrls: ['./train-schedule.component.scss'],
    imports: [
        DatePipe,
        SpinnerDirective,
        SlicePipe,
    ],
})
export class TrainScheduleComponent {

    /** Component configuration. */
    readonly config = input.required<TrainScheduleConfig>();

    /** Raw train departure schedule data received from the API. */
    readonly trainsResource = httpResource<RawNsApiDepartureResponse>(() => {
        const cfg = this.config();
        return {
            url:     'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures',
            headers: {'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': cfg.nsApiKey},
            params:  {station: cfg.departureStationCode, lang: 'en'},
        };
    });

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.trainsResource.reload());
            onCleanup(() => t.unsubscribe());
        });
    }

    /**
     * Calculate train departure delay in minutes.
     * @param dep Train to calculate the delay for.
     */
    delayInMinutes(dep: TrainDeparture): number {
        return dep.actualDateTime && dep.plannedDateTime ?
            Math.round((new Date(dep.actualDateTime).getTime() - new Date(dep.plannedDateTime).getTime()) / 60_000) :
            0;
    }
}
