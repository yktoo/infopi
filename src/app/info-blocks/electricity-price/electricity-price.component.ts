import { Component, computed, effect, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { ElectricityPriceConfig } from '../../core/config/config';

export interface ElectricityPriceData {
    /** Prices in euros, per hour [0..23]. */
    readonly hourlyPrices: number[];
    /** Surcharges such as VAT and energy tax, in euros, per hour [0..23]. */
    readonly hourlySurcharges: number[];
    /** Fixed procurement fee in euros. */
    readonly fee: number;
}

@Component({
    selector: 'app-electricity-price',
    templateUrl: './electricity-price.component.html',
    styleUrls: ['./electricity-price.component.scss'],
    imports: [
        SpinnerDirective,
        BaseChartDirective,
    ],
})
export class ElectricityPriceComponent {

    /** Component configuration. */
    readonly config = input.required<ElectricityPriceConfig>();

    /** Number of days to add to the today's date for fetching the prices. */
    readonly addDays = input(0);

    /** Date to request prices for, as an ISO string ('yyyy-mm-dd'). */
    readonly dateString = computed<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() + this.addDays());
        return d.toISOString().substring(0, 10);
    });

    /** Electricity price resource. */
    readonly pricesResource = httpResource(() =>
        `https://www.stroomperuur.nl/ajax/tarieven.php?leverancier=${this.config().supplierId}&datum=${this.dateString()}`);

    /** Today's electricity prices. */
    readonly prices = computed<ElectricityPriceData | undefined>(() => this.pricesResource.error() ? undefined : this.convertPriceData(this.pricesResource.value()));

    /** Chart data being displayed. */
    readonly chartData = computed<ChartConfiguration['data'] | undefined>(() => this.toChartData(this.prices()));

    chartOptions: ChartOptions = {
        // Disable chart animations as they seem to cause drawing issues in Electron on Raspberry Pi
        animations: false as any,
        maintainAspectRatio: false,
        layout: {
            padding: {left: 20, right: 50}
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#cccccc',
                },
            },
        },
        scales: {
            y: {
                display: true,
                position: 'left',
                grid: {
                    color: ctx => ctx.tick.value === 0 ? '#aaaaaa' : '#333333',
                    tickLength: 5,
                },
                ticks: {
                    padding: 3,
                    color: '#35c000',
                    font: {
                        size: 13,
                    }
                },
            },
            x: {
                display: true,
                grid: {
                    color: '#333333',
                    tickLength: 5,
                },
                ticks: {
                    color: '#aaaaaa',
                    font: {
                        size: 10,
                    },
                },
            },
        },
    };

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.pricesResource.reload());
            onCleanup(() => t.unsubscribe());
        });
    }

    /**
     * Convert the provided raw data into a parsed price series object.
     * @param data Input raw data.
     * @private
     */
    private convertPriceData(data: any): ElectricityPriceData | undefined {
        // Data validity check
        const isHourly = (d: any): d is number[] => Array.isArray(d) && d.length === 24 && d.every(e => typeof e === 'number');
        if (!Array.isArray(data) || data.length !== 4 || !isHourly(data[0]) || !isHourly(data[1])) {
            return undefined;
        }

        // Convert the data
        return {
            hourlyPrices:     data[0],
            hourlySurcharges: data[1],
            fee:              data[3],
        };
    }

    private toChartData(data: ElectricityPriceData | undefined): ChartConfiguration['data'] | undefined {
        if (!data) {
            return undefined;
        }

        return {
            datasets: [
                {
                    label:                'Market',
                    data:                 data.hourlyPrices,
                    borderColor:          '#35c000',
                    backgroundColor:      '#35c00050',
                    pointBorderColor:     '#35c000',
                    pointBackgroundColor: '#35c000',
                    pointRadius:          1,
                    borderWidth:          2,
                    tension:              0.5,
                    fill:                 true,
                },
                {
                    label:                'All-in',
                    data:                 data.hourlyPrices.map((p, i) => p + data.hourlySurcharges[i]),
                    borderColor:          '#00e9ca',
                    backgroundColor:      '#00e9ca50',
                    pointBorderColor:     '#00e9ca',
                    pointBackgroundColor: '#00e9ca',
                    pointRadius:          1,
                    borderWidth:          2,
                    tension:              0.5,
                    fill:                 '-1',
                },
            ],
            labels: data.hourlyPrices.map((_, idx) => `${idx}:00`),
        };
    }
}
