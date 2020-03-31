import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';
import { OpenhabService } from '../_services/openhab.service';

@Component({
    selector: 'app-domotics',
    templateUrl: './domotics.component.html',
    styleUrls: ['./domotics.component.scss']
})
export class DomoticsComponent implements OnInit {

    items: any[];
    error: any;

    constructor(private openhab: OpenhabService, private config: ConfigService) { }

    ngOnInit(): void {
        timer(0, this.config.configuration.domotics.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.openhab.getItems(this.config.configuration.domotics.showGroup)
            .subscribe(
                data => {
                    this.items = data
                        .sort((a, b) =>
                            (a.label || a.name) > (b.label || b.name) ? 1 :
                            (a.label || a.name) < (b.label || b.name) ? -1 :
                            0);
                    this.error = undefined;
                },
                error => this.error = error);
    }}
