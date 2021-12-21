import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { ConfigService } from '../_services/config.service';
import { OpenHabService } from '../_services/open-hab.service';
import { DataLoading, loadsDataInto } from '../_utils/data-loading';

@Component({
    selector: 'app-domotics',
    templateUrl: './domotics.component.html',
    styleUrls: ['./domotics.component.scss'],
})
export class DomoticsComponent implements OnInit, DataLoading {

    items: any[];
    error: any;
    dataLoading = false;

    constructor(private openhab: OpenHabService, private cfgSvc: ConfigService) { }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.domotics.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.openhab.getItems(this.cfgSvc.configuration.domotics.showGroup)
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
        this.items = data.sort((a, b) => (a.label || a.name).localeCompare(b.label || b.name));
    }
}
