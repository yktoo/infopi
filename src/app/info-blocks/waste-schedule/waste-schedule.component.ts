import { Component, computed, effect, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpHeaders, httpResource } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { WasteScheduleConfig } from '../../core/config/config';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { DateName, RawMijnAfvalwijzerResponse, WasteCollectionDay } from './models';

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
export class WasteScheduleComponent {

    /** Component configuration. */
    readonly config = input.required<WasteScheduleConfig>();

    /** Waste collection schedule resource. */
    readonly wcsResource = httpResource<RawMijnAfvalwijzerResponse>(() => {
        const cfg = this.config();
        return {
            url: 'https://api.mijnafvalwijzer.nl/webservices/appsinput/',
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
    });

    /** Waste collection data being displayed. */
    readonly collectionDays = computed<WasteCollectionDay[] | undefined>(() => {
        if (!this.wcsResource.hasValue()) {
            return undefined;
        }

        // Calculate the "today's midnight"
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        const oneDay = 24 * 3600 * 1000;

        // Process the raw days
        return this.wcsResource.value()?.data?.ophaaldagen?.data
            // Convert into a "parsed" model
            ?.map<WasteCollectionDay>(rd => {
                // Parse the string into a Date
                const date = new Date(rd.date);

                // Determine the "date name"
                let dateName: DateName = '';
                const tDiff = todayTime - date.getTime();
                if (tDiff > 0 && tDiff <= oneDay) {
                    dateName = 'yesterday';
                } else if (tDiff <= 0 && tDiff > -oneDay) {
                    dateName = 'today';
                } else if (tDiff <= -oneDay && tDiff > -2*oneDay) {
                    dateName = 'tomorrow';
                }
                return {type: rd.type, date, dateName, daysFromNow: Math.floor(-tDiff / oneDay)};
            })
            // Sort by date
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            // Only keep dates starting yesterday on
            .filter(d => d.date.getTime() >= todayTime - oneDay)
            // Limit the number of days
            .slice(0, this.config().maxCount);

    });

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.wcsResource.reload());
            onCleanup(() => t.unsubscribe());
        });
    }
}
