import { Component, OnInit } from '@angular/core';
import { BuienradarService } from '../_services/buienradar.service';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ChartDataset, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

    currentWeather: any;
    weatherForecast: any[];
    sunMoon: any;
    radarMapUrl: SafeResourceUrl;
    error: any;

    chartLabels: string[];
    chartDatasets: ChartDataset[];
    chartOptions: ChartOptions = {
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
    };

    private WEEKDAY_NAME_MAP = {
        ma: 'Mon',
        di: 'Tue',
        wo: 'Wed',
        do: 'Thu',
        vr: 'Fri',
        za: 'Sat',
        zo: 'Sun',
    };

    constructor(private weather: BuienradarService, private cfgSvc: ConfigService) { }

    /**
     * Convert Buienradar's datetime of the format 'mm/dd/yyyy hh:mm:ss' into the ISO 8601 format.
     */
    private static convertDate(s: string): Date {
        return new Date(s.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)\s+([\d:]+)/, '$3-$1-$2T$4'));
    }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.weather.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.weather.getWeather().subscribe({
            next:  data => this.processData(data),
            error: error => this.error = error,
        });

        // Update the current radar map URL to reload the image
        this.radarMapUrl = this.weather.getRadarMapUrl();
    }

    private processData(data: any) {
        // Remove any error
        this.error = undefined;

        // Find the desired weather station by its ID
        const curWeather = data.actueel_weer[0];

        // Prepare the current weather
        const id = this.cfgSvc.configuration.weather.buienRadarStationId;
        const station = curWeather.weerstations[0].weerstation.find(e => e.$.id === id);
        if (station) {
            const icon = station.icoonactueel[0].$;
            this.currentWeather = {
                station: {
                    code:       station.stationcode[0],
                    name:       station.stationnaam[0],
                    latitude:   station.lat[0],
                    longitude:  station.lon[0],
                    updated:    WeatherComponent.convertDate(station.datum[0]),
                },
                temperature:    station.temperatuurGC[0],                  // In °C
                humidity:       station.luchtvochtigheid[0],
                pressure:       station.luchtdruk[0],                      // In hPa
                wind: {
                    dirText:    station.windrichting[0],                   // Text, like 'WZW'
                    dirDegrees: station.windrichtingGR[0],                 // In degrees
                    speed:      station.windsnelheidBF[0],                 // In bft
                    gusts:      station.windstotenMS[0]                    // In m/s
                },
                rain:           station.regenMMPU[0],                      // In mm/h
                visibility:     station.zichtmeters[0],                    // In metres
                icon: {
                    url:        icon.text,                                 // Full URL, ie. http://...
                    wiClass:    this.weather.getWeatherIconClass(icon.ID), // One of the wi-* classes
                    text:       icon.zin,                                  // In Dutch
                },
                message:        data.verwachting_vandaag[0].samenvatting,
            };
        } else {
            this.currentWeather = {};
        }

        // Prepare weather forecast
        const forecast = [];
        const forecastChartLabels = [];
        const forecastChartDataHighMax = [];
        const forecastChartDataHighMin = [];
        const forecastChartDataLowMax = [];
        const forecastChartDataLowMin = [];
        for (let i = 1; i <= 5; i++) {
            const dayWeather = data.verwachting_meerdaags[0]['dag-plus' + i][0];
            const dayIcon = dayWeather.icoon[0];
            const dow = this.WEEKDAY_NAME_MAP[dayWeather.dagweek[0]];

            // Push table data
            forecast.push({
                date:            dayWeather.datum[0],        // Full date, eg 'zondag 17 april 2016'
                dow,
                probSun:         dayWeather.kanszon[0],      // Probability in percent
                probSnow:        dayWeather.sneeuwcms[0],    // Probability in percent
                rain: {
                    probability: dayWeather.kansregen[0],    // Probability in percent
                    minAmount:   dayWeather.minmmregen[0],   // Minimum amount in mm
                    maxAmount:   dayWeather.maxmmregen[0],   // Maximum amount in mm
                },
                temperature: {
                    highMax:     dayWeather.maxtempmax[0],   // In °C
                    highMin:     dayWeather.maxtemp[0],      // In °C
                    lowMax:      dayWeather.mintempmax[0],   // In °C
                    lowMin:      dayWeather.mintemp[0],      // In °C
                },
                wind: {
                    dirText:     dayWeather.windrichting[0], // Text, like 'WZW'
                    speed:       dayWeather.windkracht[0],   // In bft
                },
                icon: {
                    url:         dayIcon._,
                    wiClass:     this.weather.getWeatherIconClass(dayIcon.$.ID),
                },
            });

            // Push chart data
            forecastChartLabels.push(dow);
            forecastChartDataHighMax.push(dayWeather.maxtempmax[0]);
            forecastChartDataHighMin.push(dayWeather.maxtemp[0]);
            forecastChartDataLowMax.push(dayWeather.mintempmax[0]);
            forecastChartDataLowMin.push(dayWeather.mintemp[0]);
        }
        const transparent = 'rgba(0,0,0,0)';
        this.weatherForecast = forecast;
        this.chartLabels = forecastChartLabels;
        this.chartDatasets = [
            {
                label:                'High min',
                data:                 forecastChartDataHighMin,
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
                data:                 forecastChartDataHighMax,
                borderColor:          '#ffcc00',
                backgroundColor:      transparent,
                pointBorderColor:     '#ffcc00',
                pointBackgroundColor: '#ffcc00',
                borderWidth:          2,
                tension:              0.5,
            },
            {
                label:                'Low min',
                data:                 forecastChartDataLowMin,
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
                data:                 forecastChartDataLowMax,
                borderColor:          '#99ccff',
                backgroundColor:      transparent,
                pointBorderColor:     '#99ccff',
                pointBackgroundColor: '#99ccff',
                borderWidth:          1,
                tension:              0.5,
            },
        ];

        // Prepare sunrise, sunset and moon phase
        const moonPhase = this.weather.getMoonPhase();
        this.sunMoon = {
            sunrise:          WeatherComponent.convertDate(curWeather.buienradar[0].zonopkomst[0]),
            sunset:           WeatherComponent.convertDate(curWeather.buienradar[0].zononder[0]),
            moonPhase:        moonPhase.phase,  // Moon phase in days (0..27)
            moonPhaseText:    moonPhase.text,   // Textual description
            moonPhaseWiClass: moonPhase.wicls,  // One of the wi-* classes
        };
    }

}
