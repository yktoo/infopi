import { Component, computed, effect, input } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { HomeAutomationConfig } from '../../core/config/config';

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
    selector: 'app-home-automation',
    templateUrl: './home-automation.component.html',
    styleUrls: ['./home-automation.component.scss'],
    imports: [
        LowerCasePipe,
        SpinnerDirective,
    ],
})
export class HomeAutomationComponent {

    /** Component configuration. */
    readonly config = input.required<HomeAutomationConfig>();

    /** Waste collection schedule resource. */
    readonly itemsResource = httpResource<{readonly members: OpenHabItem[]}>(() => {
        const cfg = this.config();
        return `${cfg.openHabServerUrl}/rest/items/${cfg.showGroup}`;
    });

    /** Items being displayed. */
    readonly items = computed<OpenHabItem[] | undefined>(() =>
        this.itemsResource.hasValue() ?
            // Sort members by label/name
            this.itemsResource.value()?.members.sort((a, b) => (a.label || a.name).localeCompare(b.label || b.name)) :
            undefined);

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.itemsResource.reload());
            onCleanup(() => t.unsubscribe());
        });
    }
}
