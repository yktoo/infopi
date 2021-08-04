import { Component, OnInit } from '@angular/core';
import { NsService } from '../_services/ns.service';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';

@Component({
    selector: 'app-train',
    templateUrl: './train.component.html',
    styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {

    departureStation: string;
    departures: any;
    error: any;

    constructor(private cfgSvc: ConfigService, private ns: NsService) { }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.trains.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.departureStation = this.cfgSvc.configuration.trains.departureTimesStationName;
        this.ns.getDepartureTimes(this.cfgSvc.configuration.trains.departureTimesStationCode)
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });
    }

    private processData(data: any) {
        // Remove any error
        this.error = undefined;

        // Handle the data
        this.departures = data
            .slice(0, this.cfgSvc.configuration.trains.maxDepartureCount)
            .map(e => {
                // Calculate delays
                const delay = Math.round(
                    (new Date(e.plannedDateTime).getTime() - new Date(e.actualDateTime).getTime()) /
                    (1000 * 60));
                if (delay > 0) {
                    e.delay = '+' + delay;
                }

                // Filter warnings
                if (e.messages) {
                    e.warnings = e.messages.filter(msg => msg.style === 'WARNING');
                }
                return e;
            });
    }
}
