import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-radar-map',
    imports: [],
    templateUrl: './radar-map.component.html',
    styleUrl: './radar-map.component.scss',
})
export class RadarMapComponent {

    private readonly sanitizer = inject(DomSanitizer);

    /** URL of the radar map to show. */
    readonly mapUrl = input.required<string>();

    /** "Safe" version of the mapUrl. */
    readonly safeMapUrl = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.mapUrl()));
}
