import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ConfigService } from '../_services/config.service';
import { DataLoading, loadsDataInto } from '../_utils/data-loading';
import { SpinnerDirective } from '../_directives/spinner.directive';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    imports: [
        SpinnerDirective,
        BaseChartDirective,
    ],
})
export class ChartComponent implements OnInit, DataLoading {

    error: any;
    dataLoading = false;

    chartLabels: string[];
    chartData: ChartConfiguration['data'];
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
            yLeft: {
                display: true,
                position: 'left',
                grid: {
                    color: ctx => ctx.tick.value === 0 ? '#888888' : '#333333',
                    tickLength: 5,
                },
                ticks: {
                    padding: 3,
                    color: '#a0dbff',
                    font: {
                        size: 13,
                    }
                },
            },
            yRight: {
                display: true,
                position: 'right',
                ticks: {
                    padding: 3,
                    color: '#ffb45e',
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
                    color: '#666666',
                    font: {
                        size: 10,
                    },
                },
            },
        },
    };

    constructor(
        private readonly http: HttpClient,
        private readonly cfgSvc: ConfigService,
    ) {}

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.chart.refreshRate).subscribe(() => this.update());
    }

    update(): void {
        this.http.get<any[]>(this.cfgSvc.corsProxy + this.cfgSvc.configuration.chart.url)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  data => this.processData(data),
                error: err => this.error = err,
            });
    }

    private processData(data: any[]) {
        // Remove any error
        this.error = undefined;

        // Group the data by date
        const cdata = data.reduce(
            (acc, cur) => {
                const date = cur.Date_of_publication;
                const vals = acc[date] || {cases: 0, deceased: 0};
                vals.cases    += cur.Total_reported;
                vals.deceased += cur.Deceased;
                acc[date] = vals;
                return acc;
            },
            {});

        // Sort by date (reverse chronological)
        this.chartLabels = [];
        const cases:    number[] = [];
        const deceased: number[] = [];
        Object.keys(cdata)
            .sort((a, b) => a.localeCompare(b))
            // Truncate the dataset
            .slice(-this.cfgSvc.configuration.chart.maxElements)
            // Prepare datasets for the chart
            .forEach(date => {
                const vals = cdata[date];
                this.chartLabels.push(date);
                cases.push(vals.cases);
                deceased.push(vals.deceased);
            });

        // Prepare data series
        const transparent = 'rgba(0,0,0,0)';
        this.chartData = {
            datasets: [
                {
                    label:                'COVID-19 cases',
                    yAxisID:              'yLeft',
                    data:                 cases,
                    borderColor:          '#a0dbff',
                    backgroundColor:      transparent,
                    pointBorderColor:     transparent,
                    pointBackgroundColor: transparent,
                    pointRadius:          1,
                    borderWidth:          2
                },
                {
                    label:                'Deceased',
                    yAxisID:              'yRight',
                    data:                 deceased,
                    borderColor:          '#ffb45e',
                    backgroundColor:      transparent,
                    pointBorderColor:     transparent,
                    pointBackgroundColor: transparent,
                    pointRadius:          1,
                    borderWidth:          2
                },
            ]
        };
    }
}
