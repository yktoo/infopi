import { Component, computed, input } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { WeatherDayForecast } from '../models';

@Component({
    selector: 'app-weather-forecast',
    imports: [
        BaseChartDirective,
        DatePipe,
    ],
    templateUrl: './weather-forecast.component.html',
    styleUrl: './weather-forecast.component.scss',
})
export class WeatherForecastComponent {

    /** Weather forecasts for the upcoming days. */
    readonly dayForecasts = input.required<WeatherDayForecast[]>();

    /** Temperature chart options. */
    readonly chartOptions: ChartOptions<'line'> = {
        // Disable chart animations as they seem to cause drawing issues in Electron on Raspberry Pi
        animations: false as any,
        maintainAspectRatio: false,
        layout: {
            padding: {left: 20, right: 50}
        },
        scales: {
            y: {
                display: true,
                grid: {
                    color:     ctx => ctx.tick.value === 0 ? '#aaaaaa' : '#333333',
                    lineWidth: ctx => ctx.tick.value === 0 ? 2 : 1,
                    tickLength: 5,
                },
                ticks: {
                    padding: 10,
                    font: {
                        size: 15,
                    },
                },
            },
            x: {display: false},
        },
        plugins: {
            legend: {display: false},
        }
    };

    /** Temperature chart data. */
    readonly chartData = computed<ChartData<'line'>>(() => {
        const df = this.dayForecasts();
        return {
            datasets: [
                {
                    label:                'High min',
                    data:                 df.map(f => f.temperature.highMin),
                    borderColor:          '#ffcc00',
                    backgroundColor:      '#ffcc0050',
                    pointBorderColor:     '#ffcc00',
                    pointBackgroundColor: '#ffcc00',
                    borderWidth:          1,
                    tension:              0.5,
                    fill:                 '+1',
                },
                {
                    label:                'High max',
                    data:                 df.map(f => f.temperature.highMax),
                    borderColor:          '#ffcc00',
                    pointBorderColor:     '#ffcc00',
                    pointBackgroundColor: '#ffcc00',
                    borderWidth:          2,
                    tension:              0.5,
                },
                {
                    label:                'Low min',
                    data:                 df.map(f => f.temperature.lowMin),
                    borderColor:          '#99ccff',
                    backgroundColor:      '#99ccff50',
                    pointBorderColor:     '#99ccff',
                    pointBackgroundColor: '#99ccff',
                    borderWidth:          2,
                    tension:              0.5,
                    fill:                 '+1',
                },
                {
                    label:                'Low max',
                    data:                 df.map(f => f.temperature.lowMax),
                    borderColor:          '#99ccff',
                    pointBorderColor:     '#99ccff',
                    pointBackgroundColor: '#99ccff',
                    borderWidth:          1,
                    tension:              0.5,
                },
            ],
            labels: df.map(f => formatDate(f.date, 'ccc', 'en')),
        };
    });
}
