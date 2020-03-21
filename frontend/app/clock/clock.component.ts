import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { ConfigService } from '../_services/config.service';

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {

    now: Date = new Date();

    constructor(private config: ConfigService) { }

    ngOnInit(): void {
        timer(0, this.config.configuration.clock.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.now = new Date();
    }

}
