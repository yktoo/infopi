import { Component, OnInit } from '@angular/core';
import { BuienradarService } from '../_services/buienradar.service';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ChartData, ChartOptions } from 'chart.js';
import { WeatherDayForecast } from '../_models/weather-day-forecast';
import { DataLoading, loadsDataInto } from '../_utils/data-loading';

@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, DataLoading {

    currentWeather: any;
    dayForecasts: WeatherDayForecast[];
    sunMoon: any;
    radarMapUrl: SafeResourceUrl;
    error: any;
    dataLoading = false;

    chartData: ChartData<'line'>;
    chartOptions: ChartOptions<'line'> = {
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

    private readonly WEEKDAY_NAME_MAP = {
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
        this.weather.getWeather()
            .pipe(loadsDataInto(this))
            .subscribe({
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
        this.dayForecasts = [1, 2, 3, 4, 5]
            .map(i => data.verwachting_meerdaags[0][`dag-plus${i}`][0])
            .map(dw => ({
                date:            dw.datum[0],        // Full date, eg 'zondag 17 april 2016'
                dow:             this.WEEKDAY_NAME_MAP[dw.dagweek[0]],
                probSun:         dw.kanszon[0],      // Probability in percent
                probSnow:        dw.sneeuwcms[0],    // Probability in percent
                rain: {
                    probability: dw.kansregen[0],    // Probability in percent
                    minAmount:   dw.minmmregen[0],   // Minimum amount in mm
                    maxAmount:   dw.maxmmregen[0],   // Maximum amount in mm
                },
                temperature: {
                    highMax:     dw.maxtempmax[0],   // In °C
                    highMin:     dw.maxtemp[0],      // In °C
                    lowMax:      dw.mintempmax[0],   // In °C
                    lowMin:      dw.mintemp[0],      // In °C
                },
                wind: {
                    dirText:     dw.windrichting[0], // Text, like 'WZW'
                    speed:       dw.windkracht[0],   // In bft
                },
                icon: {
                    url:         dw.icoon[0]._,
                    wiClass:     this.weather.getWeatherIconClass(dw.icoon[0].$.ID),
                },
            }));

        this.chartData = {
            datasets: [
                {
                    label:                'High min',
                    data:                 this.dayForecasts.map(f => f.temperature.highMin),
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
                    data:                 this.dayForecasts.map(f => f.temperature.highMax),
                    borderColor:          '#ffcc00',
                    pointBorderColor:     '#ffcc00',
                    pointBackgroundColor: '#ffcc00',
                    borderWidth:          2,
                    tension:              0.5,
                },
                {
                    label:                'Low min',
                    data:                 this.dayForecasts.map(f => f.temperature.lowMin),
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
                    data:                 this.dayForecasts.map(f => f.temperature.lowMax),
                    borderColor:          '#99ccff',
                    pointBorderColor:     '#99ccff',
                    pointBackgroundColor: '#99ccff',
                    borderWidth:          1,
                    tension:              0.5,
                },
            ],
            labels: this.dayForecasts.map(f => f.dow),
        };

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
