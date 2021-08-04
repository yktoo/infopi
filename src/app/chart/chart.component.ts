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
        scales: {
            yAxes: [{
                display: true,
                gridLines: {
                    color: '#333333',
                    zeroLineWidth: 2,
                    zeroLineColor: '#888888',
                    tickMarkLength: 5,
                },
                ticks: {
                    padding: 10,
                    fontColor: '#666666',
                    fontSize: 16,
                },
            }],
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

        // Truncate the data
        data = data.slice(-this.cfgSvc.configuration.chart.maxElements);

        // Map the labels
        this.chartLabels = data.map(e => e.Date);

        // Map the data series
        const transparent = 'rgba(0,0,0,0)';
        this.chartDatasets = [
            {
                label: 'Min',
                // Use the average figure whenever possible, otherwise grab the mean
                data: data.map(e => Number(e.Rt_avg) || (Number(e.Rt_low) + Number(e.Rt_up)) / 2),
                borderColor: '#ffa0a0',
                backgroundColor: transparent,
                pointBorderColor: '#b94646',
                pointBackgroundColor: '#b94646',
                pointRadius: 1,
                borderWidth: 2
            },
        ];
    }

}
