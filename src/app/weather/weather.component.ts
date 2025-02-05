import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';
import { timer } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { BuienradarService } from '../_services/buienradar.service';
import { ConfigService } from '../_services/config.service';
import { CurrentWeather, RawWeatherData, WeatherDayForecast } from '../_models/weather-data';
import { DataLoading, loadsDataInto } from '../_utils/data-loading';
import { SpinnerDirective } from '../_directives/spinner.directive';
import { TruncatePipe } from '../_pipes/truncate.pipe';
import { TimeAgoPipe } from '../_pipes/time-ago.pipe';

@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss'],
    imports: [
        SpinnerDirective,
        NgClass,
        TruncatePipe,
        TimeAgoPipe,
        DecimalPipe,
        DatePipe,
        BaseChartDirective,
    ],
})
export class WeatherComponent implements OnInit, DataLoading {

    currentWeather?: CurrentWeather;
    dayForecasts: WeatherDayForecast[];
    sunMoon: any;
    radarMapUrl: SafeResourceUrl;
    error: any;
    dataLoading = false;

    chartData: ChartData<'line'>;
    chartOptions: ChartOptions<'line'> = {
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

    private readonly WEEKDAY_NAME_MAP: { [k: string]: string } = {
        ma: 'Mon',
        di: 'Tue',
        wo: 'Wed',
        do: 'Thu',
        vr: 'Fri',
        za: 'Sat',
        zo: 'Sun',
    };

    constructor(
        private readonly weather: BuienradarService,
        private readonly cfgSvc: ConfigService,
    ) {}

    /**
     * Convert Buienradar's datetime of the format 'mm/dd/yyyy hh:mm:ss' into the ISO 8601 format.
     */
    private static convertDate(s: string): Date {
        return new Date(s.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)\s+([\d:]+)/, '$3-$1-$2T$4'));
    }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.weather.refreshRate).subscribe(() => this.update());
        // Bump the "updated" value to update the "time ago" value (which just changes over time, without a change in the underlying value)
        timer(0, 30 * 1000)
            .subscribe(() =>
                this.currentWeather?.station?.updated &&
                (this.currentWeather.station.updated = new Date(this.currentWeather.station.updated)));
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

    private processData(data: RawWeatherData) {
        // Remove any error
        this.error = undefined;

        // Find the desired weather station by its ID
        const curWeather = data.actueel_weer;

        // Prepare the current weather
        const id = this.cfgSvc.configuration.weather.buienRadarStationId;
        const station = curWeather.weerstations.weerstation.find(e => e.attr.id === id);
        if (station) {
            const icon = station.icoonactueel;
            this.currentWeather = {
                station: {
                    code:       station.stationcode.text,
                    name:       station.stationnaam.text,
                    latitude:   station.lat.text,
                    longitude:  station.lon.text,
                    updated:    WeatherComponent.convertDate(station.datum.text),
                },
                temperature:    station.temperatuurGC.text,
                humidity:       station.luchtvochtigheid.text,
                pressure:       station.luchtdruk.text,
                wind: {
                    dirText:    station.windrichting.text,
                    dirDegrees: station.windrichtingGR.text,
                    speed:      station.windsnelheidBF.text,
                    gusts:      station.windstotenMS.text
                },
                rain:           station.regenMMPU.text,
                visibility:     station.zichtmeters.text,
                icon: {
                    url:        icon.text,
                    wiClass:    this.weather.getWeatherIconClass(icon.attr.ID),
                    text:       icon.attr.zin,
                },
                message:        data.verwachting_vandaag.samenvatting.text,
            };
        } else {
            this.currentWeather = undefined;
        }

        // Prepare weather forecast
        this.dayForecasts = [1, 2, 3, 4, 5]
            .map(i => data.verwachting_meerdaags[`dag-plus${i}` as 'dag-plus1'])
            .map(dw => ({
                date:            dw.datum.text,               // Full date, eg 'zondag 17 april 2016'
                dow:             this.WEEKDAY_NAME_MAP[dw.dagweek.text],
                probSun:         Number(dw.kanszon.text),     // Probability in percent
                probSnow:        Number(dw.sneeuwcms.text),   // Probability in percent
                rain: {
                    probability: Number(dw.kansregen.text),   // Probability in percent
                    minAmount:   Number(dw.minmmregen.text),  // Minimum amount in mm
                    maxAmount:   Number(dw.maxmmregen.text),  // Maximum amount in mm
                },
                temperature: {
                    highMax:     Number(dw.maxtempmax.text),  // In °C
                    highMin:     Number(dw.maxtemp.text),     // In °C
                    lowMax:      Number(dw.mintempmax.text),  // In °C
                    lowMin:      Number(dw.mintemp.text),     // In °C
                },
                wind: {
                    dirText:     dw.windrichting.text,        // Text, like 'WZW'
                    speed:       Number(dw.windkracht.text),  // In bft
                },
                icon: {
                    url:         dw.icoon.text,
                    wiClass:     this.weather.getWeatherIconClass(dw.icoon.attr.ID),
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
            sunrise:          WeatherComponent.convertDate(curWeather.buienradar.zonopkomst.text),
            sunset:           WeatherComponent.convertDate(curWeather.buienradar.zononder.text),
            moonPhase:        moonPhase.phase,  // Moon phase in days (0..27)
            moonPhaseText:    moonPhase.text,   // Textual description
            moonPhaseWiClass: moonPhase.wicls,  // One of the wi-* classes
        };
    }

}
