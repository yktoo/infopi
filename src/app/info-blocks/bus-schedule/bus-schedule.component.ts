import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataLoading, loadsDataInto } from '../../_utils/data-loading';
import { Animations } from '../../_utils/animations';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { APP_CONFIG } from '../../core/config/config';

@Component({
    selector: 'app-bus',
    templateUrl: './bus-schedule.component.html',
    styleUrls: ['./bus-schedule.component.scss'],
    animations: [Animations.fadeTableRow()],
    imports: [
        SpinnerDirective,
        DatePipe,
    ],
})
export class BusScheduleComponent implements OnInit, DataLoading {

    private static baseUrl = 'https://v0.ovapi.nl/stopareacode/';

    private readonly config = inject(APP_CONFIG).busSchedule;
    private readonly http = inject(HttpClient);

    readonly departureStation = this.config.ovapiStopName;

    departures: any;
    error: any;
    dataLoading = false;

    ngOnInit(): void {
        timer(0, this.config.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.getDepartureTimes(this.config.ovapiStopCode)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });
    }

    /**
     * Request bus departure times for the specified stop and return them wrapped in an Observable.
     * @param stopCode Bus stop code to request departure times for.
     */
    private getDepartureTimes(stopCode: string): Observable<any> {
        return this.http.get(BusScheduleComponent.baseUrl + stopCode).pipe(map((data: any) => data[stopCode]));
    }

    private processData(data: any) {
        // Remove any error
        this.error = undefined;

        // Handle the data
        this.departures = Object.values(data)
            // Flatten passes
            .flatMap(stop => Object.values((stop as any).Passes))
            .map(pass => pass as any)
            // Calculate delays
            .map(pass => {
                const delay = Math.round(
                    (new Date(pass.TargetDepartureTime).getTime() - new Date(pass.ExpectedDepartureTime).getTime()) /
                    (1000 * 60));
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
            .slice(0, this.config.maxDepartureCount);
    }
}
