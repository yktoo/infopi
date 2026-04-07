import { Component, effect, inject, input, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { WasteScheduleConfig } from '../../core/config/config';
import { DataLoading, loadsDataInto } from '../../core/data-loading';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';

export interface RawWasteCollectionDay {
    nameType: string;
    type: string;
    date: string;
}

export type DateName = '' | 'yesterday' | 'today' | 'tomorrow';

export interface WasteCollectionDay {
    type:     string;
    date:     Date;
    dateName: DateName;
}

@Component({
    selector: 'app-waste-schedule',
    imports: [
        DatePipe,
        SpinnerDirective,
        TitleCasePipe,
    ],
    templateUrl: './waste-schedule.component.html',
    styleUrl: './waste-schedule.component.scss',
})
export class WasteScheduleComponent implements DataLoading {

    /** API URL of mijnafvalwijzer.nl */
    private static apiUrl = 'https://api.mijnafvalwijzer.nl/webservices/appsinput/';

    /** Component configuration. */
    readonly config = input.required<WasteScheduleConfig>();

    private readonly http = inject(HttpClient);

    /** Waste collection data being displayed. */
    readonly collectionDays = signal<WasteCollectionDay[] | undefined>(undefined);

    /** Error occurred during data load, if any. */
    readonly error = signal<any>(undefined);

    dataLoading = false;

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.update());
            onCleanup(() => t.unsubscribe());
        });
    }

    /**
     * Update the displayed content.
     */
    update(): void {
        // Remove any error
        this.error.set(undefined);

        // Request waste collection times by waste type
        const cfg = this.config();
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            params: {
                apikey:     cfg.apiKey,
                method:     'postcodecheck',
                postcode:   cfg.postalCode,
                street:     '',
                huisnummer: cfg.houseNumber,
                toevoeging: cfg.houseNumberAddition,
                app_name:   'afvalwijzer',
                platform:   'web',
                langs:      'nl',
            },
        };

        // Request the data
        this.http.get<any>(WasteScheduleComponent.apiUrl, httpOptions)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  r => this.processData(r.data.ophaaldagen.data),
                error: e => this.error.set(e),
            });
    }

    private processData(days: RawWasteCollectionDay[]): void {
        // Calculate the "today's midnight"
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Process the raw days
        this.collectionDays.set(days
            // Convert into a "parsed" model
            .map(rd => {
                const date = new Date(rd.date);

                // Determine the "date name"
                let dateName: DateName = '';
                const tDiff = today.getTime() - date.getTime();
                const oneDay = 24 * 3600 * 1000;
                if (tDiff > 0 && tDiff <= oneDay) {
                    dateName = 'yesterday';
                } else if (tDiff <= 0 && tDiff > -oneDay) {
                    dateName = 'today';
                } else if (tDiff <= -oneDay && tDiff > -2*oneDay) {
                    dateName = 'tomorrow';
                }
                return {
                    type: rd.type,
                    date,
                    dateName,
                } as WasteCollectionDay;
            })
            // Sort by date
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            // Only keep the current and future dates
            .filter(d => d.date >= today)
            // Limit the number of days
            .slice(0, this.config().maxCount));
    }
}
