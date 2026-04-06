import { Component, effect, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { TrainDeparture, TrainMessage } from './train-departure';
import { DataLoading, loadsDataInto } from '../../core/data-loading';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { TrainScheduleConfig } from '../../core/config/config';

/**
 * Extension of TrainDeparture, which also allows to store delays and warnings.
 */
export interface ExtendedTrainDeparture extends TrainDeparture {
    delay?:       string;
    disruptions?: TrainMessage[];
}

@Component({
    selector: 'app-train',
    templateUrl: './train-schedule.component.html',
    styleUrls: ['./train-schedule.component.scss'],
    imports: [
        DatePipe,
        SpinnerDirective,
    ],
})
export class TrainScheduleComponent implements DataLoading {

    /** NS API base URL. */
    private static baseUrl = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/';

    private readonly http = inject(HttpClient);

    /** Component configuration. */
    readonly config = input.required<TrainScheduleConfig>();

    /** Train departures being displayed. */
    readonly departures = signal<ExtendedTrainDeparture[] | undefined>(undefined);

    /** Error occurred during data load, if any. */
    readonly error = signal<any>(undefined);

    dataLoading = false;

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.update());
            onCleanup(() => t.unsubscribe());
        });
    }

    update() {
        // Remove any error
        this.error.set(undefined);

        // Fetch train schedule data
        const cfg = this.config();
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': this.config().nsApiKey}),
            params: {station: cfg.departureTimesStationCode, lang: 'en'},
        };
        this.http.get<any>(TrainScheduleComponent.baseUrl + 'departures', httpOptions)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  data => this.departures.set(
                    data.payload.departures
                        .slice(0, this.config().maxDepartureCount)
                        .map((e: ExtendedTrainDeparture) => {
                            // Calculate delays
                            const delay = Math.round(
                                (new Date(e.actualDateTime ?? '').getTime() - new Date(e.plannedDateTime ?? '').getTime()) /
                                (1000 * 60));
                            if (delay > 0) {
                                e.delay = '+' + delay;
                            }

                            // Filter warnings
                            e.disruptions = e.messages?.filter(msg => msg.type === 'DISRUPTION');
                            return e;
                        })),
                error: e => this.error.set(e),
            });
    }
}
