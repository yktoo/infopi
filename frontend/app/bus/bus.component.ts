import { Component, OnInit } from '@angular/core';
import { OvApiService } from '../_services/ov-api.service';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';

@Component({
    selector: 'app-bus',
    templateUrl: './bus.component.html',
    styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {

    departureStation: string;
    departures: any;

    constructor(private ov: OvApiService, private config: ConfigService) { }

    ngOnInit(): void {
        timer(0, this.config.configuration.busses.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.departureStation = this.config.configuration.busses.ovapiStopName;
        this.ov.getDepartureTimes(this.config.configuration.busses.ovapiStopCode)
            .subscribe(data => {
                this.departures = Object.values(data)
                    // Flatten passes
                    .flatMap(stop => Object.values(stop['Passes']))
                    // Calculate delays
                    .map(pass => {
                        let delay = (new Date(pass['TargetDepartureTime']).getTime() - new Date(pass['ExpectedDepartureTime']).getTime()) / (1000 * 60);
                        if (delay > 0) pass['delay'] = '+' + delay;
                        return pass;
                    })
                    // Limit the number of items
                    .slice(0, this.config.configuration.busses.maxDepartureCount);
            });
    }
}
