import { Component, inject, OnInit } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataLoading, loadsDataInto } from '../../_utils/data-loading';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { APP_CONFIG } from '../../core/config/config';

export interface OpenHabItem {
    members?:    OpenHabItem[];
    link:        string;
    state?:      string;
    editable?:   boolean;
    type:        string;
    category?:   string;
    name:        string;
    label?:      string;
    tags?:       string[];
    groupNames?: string[];
}

@Component({
    selector: 'app-domotics',
    templateUrl: './home-automation.component.html',
    styleUrls: ['./home-automation.component.scss'],
    imports: [
        LowerCasePipe,
        SpinnerDirective,
    ],
})
export class HomeAutomationComponent implements OnInit, DataLoading {

    items: OpenHabItem[];
    error: any;
    dataLoading = false;

    private readonly config = inject(APP_CONFIG).homeAutomation;
    private readonly http = inject(HttpClient);
    private readonly baseUrl = this.config.openHabServerUrl + '/rest/items/';

    ngOnInit(): void {
        timer(0, this.config.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.getItems(this.config.showGroup)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  items => this.processData(items),
                error: error => this.error = error,
            });
    }

    /**
     * Request items from the OpenHAB server and return them wrapped in an Observable.
     * @param item Regular or group item to request.
     */
    private getItems(item: string): Observable<OpenHabItem[]> {
        return this.http.get<OpenHabItem>(this.baseUrl + item).pipe(map(data => data.members));
    }

    private processData(items: OpenHabItem[]) {
        // Remove any error
        this.error = undefined;

        // Handle the data
        this.items = items.sort((a, b) => (a.label || a.name).localeCompare(b.label || b.name));
    }
}
