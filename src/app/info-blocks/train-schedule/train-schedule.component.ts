import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { TrainDeparture, TrainMessage } from './train-departure';
import { DataLoading, loadsDataInto } from '../../_utils/data-loading';
import { Animations } from '../../_utils/animations';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { APP_CONFIG } from '../../core/config/config';

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
    animations: [Animations.fadeTableRow()],
    imports: [
        DatePipe,
        SpinnerDirective,
    ],
})
export class TrainScheduleComponent implements OnInit, DataLoading {

    /** NS API base URL. */
    private static baseUrl = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/';

    private readonly config = inject(APP_CONFIG).trainSchedule;
    private readonly http = inject(HttpClient);

    readonly departureStation = this.config.departureTimesStationName;

    departures: ExtendedTrainDeparture[];
    error: any;
    dataLoading = false;

    ngOnInit(): void {
        timer(0, this.config.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.getDepartureTimes(this.config.departureTimesStationCode)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });
    }

    /**
     * Request train departure times for the specified station and return them wrapped in an Observable.
     * @param station Station code to request departure times for.
     */
    private getDepartureTimes(station: string): Observable<TrainDeparture[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.config.nsApiKey,
            }),
            params: {
                station,
                lang: 'en',
            },
        };

        // Fetch the data, then unwrap the top level
        return this.http.get<any>(TrainScheduleComponent.baseUrl + 'departures', httpOptions).pipe(map(res => res.payload.departures));
    }

    private processData(data: TrainDeparture[]) {
        // Remove any error
        this.error = undefined;

        // Handle the data
        this.departures = data
            .slice(0, this.config.maxDepartureCount)
            .map((e: ExtendedTrainDeparture) => {
                // Calculate delays
                const delay = Math.round(
                    (new Date(e.actualDateTime).getTime() - new Date(e.plannedDateTime).getTime()) /
                    (1000 * 60));
                if (delay > 0) {
                    e.delay = '+' + delay;
                }

                // Filter warnings
                e.disruptions = e.messages?.filter(msg => msg.type === 'DISRUPTION');
                return e;
            });
    }
}
