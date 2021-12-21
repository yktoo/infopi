import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { ConfigService } from '../_services/config.service';

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {

    now = new Date();

    constructor(private cfgSvc: ConfigService) { }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.clock.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.now = new Date();
    }

}
