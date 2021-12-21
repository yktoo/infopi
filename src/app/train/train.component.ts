import { Component, OnInit } from '@angular/core';
import { finalize, timer } from 'rxjs';
import { ConfigService } from '../_services/config.service';
import { NsService } from '../_services/ns.service';
import { TrainDeparture, TrainMessage } from '../_models/train-departure';

/**
 * Extension of TrainDeparture, which also allows to store delays and warnings.
 */
export interface ExtendedTrainDeparture extends TrainDeparture {
    delay?:       string;
    disruptions?: TrainMessage[];
}

@Component({
    selector: 'app-train',
    templateUrl: './train.component.html',
    styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {

    departureStation: string;
    departures: ExtendedTrainDeparture[];
    error: any;
    loading = false;

    constructor(private cfgSvc: ConfigService, private ns: NsService) {
        this.departureStation = this.cfgSvc.configuration.trains.departureTimesStationName;
    }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.trains.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.loading = true;
        this.ns.getDepartureTimes(this.cfgSvc.configuration.trains.departureTimesStationCode)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });
    }

    private processData(data: TrainDeparture[]) {
        // Remove any error
        this.error = undefined;

        // Handle the data
        this.departures = data
            .slice(0, this.cfgSvc.configuration.trains.maxDepartureCount)
            .map((e: ExtendedTrainDeparture) => {
                // Calculate delays
                const delay = Math.round(
                    (new Date(e.plannedDateTime).getTime() - new Date(e.actualDateTime).getTime()) /
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
