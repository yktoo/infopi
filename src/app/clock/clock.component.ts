import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { ConfigService } from '../_services/config.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss'],
    imports: [
        DatePipe,
    ],
})
export class ClockComponent implements OnInit {

    now = new Date();

    constructor(
        private readonly cfgSvc: ConfigService,
    ) {}

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.clock.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.now = new Date();
    }

}
