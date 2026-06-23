import { Component, computed, effect, input, signal } from '@angular/core';
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
    /** All-in prices in euros, consisting of surcharges and the fee, per hour [0..23]. */
    readonly hourlyAllInPrices: number[];
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
    readonly dateString = signal('');

    /** Electricity price resource. */
    readonly pricesResource = httpResource(
        // Postpone the request until dateString is set
        () => this.dateString() ?
            {url: 'https://www.stroomperuur.nl/ajax/tarieven.php', params: {leverancier: this.config().supplierId, datum: this.dateString()}} :
            undefined);

    /** Fetched electricity prices. */
    readonly prices = computed<ElectricityPriceData | undefined>(() =>
        this.pricesResource.error() ? undefined : this.convertPriceData(this.pricesResource.value()));

    /** Chart data being displayed. */
    readonly chartData = computed<ChartConfiguration['data'] | undefined>(() => this.toChartData(this.prices()));

    /** Chart options. */
    readonly chartOptions: ChartOptions = {
        maintainAspectRatio: false,
        layout: {padding: {left: 5, right: 5}},
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color:     '#cccccc',
                    boxWidth:  5,
                    boxHeight: 5,
                },
            },
            annotation: {annotations: []},
            datalabels: {},
        },
        scales: {
            y: {
                display: true,
                position: 'left',
                grid: {
                    color: ctx => ctx.tick.value === 0 ? '#cccccc' : '#333333',
                    tickLength: 5,
                },
                ticks: {
                    padding: 3,
                    color: ctx => ctx.tick.value < 0 ? '#8abe76' : ctx.tick.value > 0 ? '#a87070' : '#cccccc',
                    font: {size: 13},
                    callback: v => (v as number).toFixed(2),
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
        // Update the date and the "now" bar once in 5 minutes
        let tn: Subscription;
        effect(onCleanup => {
            tn = timer(0, 5 * 60 * 1000).subscribe(() => this.updateNow());
            onCleanup(() => tn.unsubscribe());
        });

        // (Re)subscribe on periodic updates
        let td: Subscription;
        effect(onCleanup => {
            td = timer(0, this.config().refreshRate).subscribe(() => this.pricesResource.reload());
            onCleanup(() => td.unsubscribe());
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
        const hourlyPrices     = data[0];
        const hourlySurcharges = data[1];
        const fee = data[3];
        return {hourlyPrices, hourlySurcharges, fee, hourlyAllInPrices: hourlyPrices.map((n, i) => n + hourlySurcharges[i] + fee)};
    }

    private toChartData(data: ElectricityPriceData | undefined): ChartConfiguration['data'] | undefined {
        if (!data) {
            return undefined;
        }

        // Find the index of the minimum/maximum all-in price
        const minPriceIdx = data.hourlyAllInPrices.reduce((minIdx, v, idx, a) => v < a[minIdx] ? idx : minIdx, 0);
        const maxPriceIdx = data.hourlyAllInPrices.reduce((maxIdx, v, idx, a) => v > a[maxIdx] ? idx : maxIdx, 0);

        // Mark the min/max points with a different colour
        const getPointColour = (ctx: any) =>
            ctx.dataIndex === minPriceIdx ? '#59ff16' : ctx.dataIndex === maxPriceIdx ? '#ff4545' : '#00e9ca';

        return {
            datasets: [
                {
                    label:                'Market',
                    data:                 data.hourlyPrices,
                    borderColor:          '#73a168',
                    backgroundColor:      '#73a16850',
                    pointBorderColor:     '#73a168',
                    pointBackgroundColor: '#73a168',
                    pointRadius:          1,
                    borderWidth:          2,
                    tension:              0.1,
                    fill:                 true,
                    datalabels: {
                        display: false,
                    }
                },
                {
                    label:                'All-in',
                    data:                 data.hourlyAllInPrices,
                    borderColor:          '#00e9ca',
                    backgroundColor:      '#00e9ca50',
                    pointBorderColor:     getPointColour,
                    pointBackgroundColor: getPointColour,
                    pointRadius:          (ctx: any) => ctx.dataIndex === minPriceIdx || ctx.dataIndex === maxPriceIdx ? 3 : 1,
                    borderWidth:          2,
                    tension:              0.1,
                    fill:                 '-1',
                    // Display a data label above the min and the max
                    datalabels: {
                        display:   ctx => ctx.dataIndex === minPriceIdx || ctx.dataIndex === maxPriceIdx,
                        color:     getPointColour,
                        align:     'top',
                        offset:    2,
                        formatter: (v: number) => v.toFixed(2),
                    }
                },
            ],
            labels: data.hourlyPrices.map((_, idx) => `${idx}:00`),
        };
    }

    private updateNow() {
        // Update the displayed date signal
        const d = new Date();
        d.setDate(d.getDate() + this.addDays());
        this.dateString.set(d.toISOString().substring(0, 10));

        // Update the "now" box annotation in the chart. Only applies when displaying today's prices
        if (this.addDays() === 0) {
            const hour = new Date().getHours();
            this.chartOptions.plugins!.annotation!.annotations = [{type: 'box', xMin: hour, xMax: hour + 1, backgroundColor: '#e0c20080'}];
        }
    }
}
