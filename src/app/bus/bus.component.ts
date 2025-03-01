import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { OvApiService } from '../_services/ov-api.service';
import { ConfigService } from '../_services/config.service';
import { DataLoading, loadsDataInto } from '../_utils/data-loading';
import { Animations } from '../_utils/animations';
import { SpinnerDirective } from '../_directives/spinner.directive';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-bus',
    templateUrl: './bus.component.html',
    styleUrls: ['./bus.component.scss'],
    animations: [Animations.fadeTableRow()],
    imports: [
        SpinnerDirective,
        DatePipe,
    ],
})
export class BusComponent implements OnInit, DataLoading {

    departures: any;
    error: any;
    dataLoading = false;

    readonly departureStation = this.cfgSvc.configuration.busses.ovapiStopName;

    constructor(
        private readonly ov: OvApiService,
        private readonly cfgSvc: ConfigService,
    ) {}

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.busses.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.ov.getDepartureTimes(this.cfgSvc.configuration.busses.ovapiStopCode)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });
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
            .slice(0, this.cfgSvc.configuration.busses.maxDepartureCount);
    }
}
