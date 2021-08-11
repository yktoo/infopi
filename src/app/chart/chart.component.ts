import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { ConfigService } from '../_services/config.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataSets, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

    error: any;

    chartLabels: string[];
    chartDatasets: ChartDataSets[];
    chartOptions: ChartOptions = {
        maintainAspectRatio: false,
        layout: {
            padding: {left: 20, right: 50}
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: '#cccccc',
            },
        },
        scales: {
            yAxes: [
                {
                    id: 'left',
                    display: true,
                    position: 'left',
                    gridLines: {
                        color: '#333333',
                        zeroLineColor: '#888888',
                        tickMarkLength: 5,
                    },
                    ticks: {
                        padding: 3,
                        fontColor: '#a0dbff',
                        fontSize: 13,
                    },
                },
                {
                    id: 'right',
                    display: true,
                    position: 'right',
                    ticks: {
                        padding: 3,
                        fontColor: '#ffb45e',
                        fontSize: 13,
                    },
                },
            ],
            xAxes: [{
                display: true,
                gridLines: {
                    color: '#333333',
                    tickMarkLength: 5,
                },
                ticks: {
                    fontColor: '#666666',
                    fontSize: 10,
                },
            }],
        },
    };

    constructor(
        private http: HttpClient,
        private cfgSvc: ConfigService,
    ) { }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.chart.refreshRate).subscribe(() => this.update());
    }

    update(): void {
        this.http.get<any[]>(this.cfgSvc.corsProxy + this.cfgSvc.configuration.chart.url)
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
                const vals = acc[date] || {cases: 0, hospital: 0, deceased: 0};
                vals.cases    += cur.Total_reported;
                vals.hospital += cur.Hospital_admission;
                vals.deceased += cur.Deceased;
                acc[date] = vals;
                return acc;
            },
            {});

        // Sort by date (reverse chronological)
        this.chartLabels = [];
        const cases:    number[] = [];
        const hospital: number[] = [];
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
                hospital.push(vals.hospital);
                deceased.push(vals.deceased);
            });

        // Prepare data series
        const transparent = 'rgba(0,0,0,0)';
        this.chartDatasets = [
            {
                label: 'COVID-19 cases',
                yAxisID: 'left',
                data: cases,
                borderColor: '#a0dbff',
                backgroundColor: transparent,
                pointBorderColor: transparent,
                pointBackgroundColor: transparent,
                pointRadius: 1,
                borderWidth: 2
            },
            {
                label: 'Hospital admissions',
                yAxisID: 'right',
                data: hospital,
                borderColor: '#ffb45e',
                backgroundColor: transparent,
                pointBorderColor: transparent,
                pointBackgroundColor: transparent,
                pointRadius: 1,
                borderWidth: 2
            },
            {
                label: 'Deceased',
                yAxisID: 'right',
                data: deceased,
                borderColor: '#ffa0a0',
                backgroundColor: transparent,
                pointBorderColor: transparent,
                pointBackgroundColor: transparent,
                pointRadius: 1,
                borderWidth: 2
            },
        ];
    }

}
