import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { ConfigService } from '../_services/config.service';
import { NsService } from '../_services/ns.service';
import { TrainDeparture, TrainMessage } from '../_models/train-departure';
import { DataLoading, loadsDataInto } from '../_utils/data-loading';
import { Animations } from '../_utils/animations';

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
    styleUrls: ['./train.component.scss'],
    animations: [Animations.fadeTableRow()],
})
export class TrainComponent implements OnInit, DataLoading {

    departures: ExtendedTrainDeparture[];
    error: any;
    dataLoading = false;

    readonly departureStation = this.cfgSvc.configuration.trains.departureTimesStationName;

    constructor(
        private readonly cfgSvc: ConfigService,
        private readonly ns: NsService,
    ) {}

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.trains.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.ns.getDepartureTimes(this.cfgSvc.configuration.trains.departureTimesStationCode)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });
    }

    journeyId(index: number, journey: ExtendedTrainDeparture): string {
        return journey.name;
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
