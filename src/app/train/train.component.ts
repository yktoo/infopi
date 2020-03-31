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

    constructor(private config: ConfigService, private ns: NsService) { }

    ngOnInit(): void {
        timer(0, this.config.configuration.trains.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.departureStation = this.config.configuration.trains.departureTimesStationName;
        this.ns.getDepartureTimes(this.config.configuration.trains.departureTimesStationCode)
            .subscribe(
                data => {
                    this.departures = data
                        .slice(0, this.config.configuration.trains.maxDepartureCount)
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
                    this.error = undefined;
                },
                error => this.error = error);
    }

}
