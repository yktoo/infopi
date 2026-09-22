import { Component, computed, input, signal } from '@angular/core';
import { ElectricityPriceComponent, PriceRange } from './electricity-price.component';
import { ElectricityPriceConfig } from '../../core/config/config';

export interface ElectricityPriceDay {
    /** Number of days to add to the today's date. */
    readonly addDays: number;
    /** Heading to display above the chart. */
    readonly label: string;
}

@Component({
    selector: 'app-electricity-prices',
    templateUrl: './electricity-prices.component.html',
    styleUrls: ['./electricity-prices.component.scss'],
    imports: [
        ElectricityPriceComponent,
    ],
})
export class ElectricityPricesComponent {

    /** Component configuration, shared by all charts. */
    readonly config = input.required<ElectricityPriceConfig>();

    /** Days to display a price chart for. */
    readonly days: readonly ElectricityPriceDay[] = [
        {addDays: 0, label: 'Today'},
        {addDays: 1, label: 'Tomorrow'},
    ];

    /** Value ranges reported by the charts, keyed by day offset. */
    private readonly ranges = signal<Record<number, PriceRange | undefined>>({});

    /** Union of the value ranges of all charts, which gives them the same vertical scale. */
    readonly yRange = computed<PriceRange | undefined>(() =>
        Object.values(this.ranges())
            .filter(r => !!r)
            .reduce<PriceRange | undefined>((acc, r) => acc ? [Math.min(acc[0], r[0]), Math.max(acc[1], r[1])] : r, undefined));

    /**
     * Store the value range reported by the chart for the given day. The ranges are kept per day, and not merged into
     * a single growing range, so that the scale also shrinks back once a day with extreme prices rolls off.
     * @param addDays Day offset of the reporting chart.
     * @param range Reported range, or undefined if the chart has no data.
     */
    setRange(addDays: number, range: PriceRange | undefined) {
        this.ranges.update(m => ({...m, [addDays]: range}));
    }
}
