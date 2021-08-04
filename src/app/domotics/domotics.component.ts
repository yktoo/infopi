import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';
import { OpenHabService } from '../_services/open-hab.service';

@Component({
    selector: 'app-domotics',
    templateUrl: './domotics.component.html',
    styleUrls: ['./domotics.component.scss'],
})
export class DomoticsComponent implements OnInit {

    items: any[];
    error: any;

    constructor(private openhab: OpenHabService, private cfgSvc: ConfigService) { }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.domotics.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.openhab.getItems(this.cfgSvc.configuration.domotics.showGroup)
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
