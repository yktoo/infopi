import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {

    now: Date = new Date();

    constructor() { }

    ngOnInit(): void {
        timer(1000, 1000).subscribe(() => this.update());
    }

    update() {
        this.now = new Date();
    }

}
