import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { ConfigService } from '../_services/config.service';
import { OpenHabItem, OpenHabService } from '../_services/open-hab.service';
import { DataLoading, loadsDataInto } from '../_utils/data-loading';
import { LowerCasePipe } from '@angular/common';
import { SpinnerDirective } from '../_directives/spinner.directive';

@Component({
    selector: 'app-domotics',
    templateUrl: './domotics.component.html',
    styleUrls: ['./domotics.component.scss'],
    imports: [
        LowerCasePipe,
        SpinnerDirective,
    ],
})
export class DomoticsComponent implements OnInit, DataLoading {

    items: OpenHabItem[];
    error: any;
    dataLoading = false;

    constructor(
        private readonly openhab: OpenHabService,
        private readonly cfgSvc: ConfigService,
    ) {}

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.domotics.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.openhab.getItems(this.cfgSvc.configuration.domotics.showGroup)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  items => this.processData(items),
                error: error => this.error = error,
            });
    }

    private processData(items: OpenHabItem[]) {
        // Remove any error
        this.error = undefined;

        // Handle the data
        this.items = items.sort((a, b) => (a.label || a.name).localeCompare(b.label || b.name));
    }
}
