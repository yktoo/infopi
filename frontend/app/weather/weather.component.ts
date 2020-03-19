import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../_services/weather.service';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';

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

constructor(private weather: WeatherService, private config: ConfigService) { }

    ngOnInit(): void {
        timer(0, this.config.refreshRate('weather')).subscribe(() => this.update());
    }

    /**
     * Convert Buienradar's datetime of the format 'mm/dd/yyyy hh:mm:ss' into the ISO 8601 format.
     */
    private static convertDate(s: string): Date {
        return new Date(s.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)\s+([\d:]+)/, '$3-$1-$2T$4'));
    }

    update() {
        this.weather.getWeather().subscribe(data => {
            // Find the desired weather station by its ID
            const id = this.config.buienRadarStationId;
            let curWeather = data.actueel_weer[0];

            // Prepare the current weather
            let station = curWeather.weerstations[0].weerstation.find(e => e.$.id === id);
            if (station) {
                let icon = station.icoonactueel[0].$;
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
            let forecast = [];
            for (let i = 1; i <= 5; i++) {
                let dayWeather = data.verwachting_meerdaags[0]['dag-plus' + i][0];
                let dayIcon = dayWeather.icoon[0];
                forecast.push({
                    date:            dayWeather.datum[0],        // Full date, eg 'zondag 17 april 2016'
                    dow:             dayWeather.dagweek[0],      // Weekday name
                    probSun:         dayWeather.kanszon[0],      // Probability in percent
                    probSnow:        dayWeather.sneeuwcms[0],    // Probability in percent
                    rain: {
                        probability: dayWeather.kansregen[0],    // Probability in percent
                        minAmount:   dayWeather.minmmregen[0],   // Minimum amount in mm
                        maxAmount:   dayWeather.maxmmregen[0],   // Maximum amount in mm
                    },
                    temperature: {
                        lowMin:      dayWeather.mintemp[0],      // In °C
                        lowMax:      dayWeather.mintempmax[0],   // In °C
                        highMin:     dayWeather.maxtemp[0],      // In °C
                        highMax:     dayWeather.maxtempmax[0],   // In °C
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
            }
            this.weatherForecast = forecast;

            // Prepare sunrise, sunset and moon phase
            let moonPhase = this.weather.getMoonPhase();
            this.sunMoon = {
                sunrise:          WeatherComponent.convertDate(curWeather.buienradar[0].zonopkomst[0]),
                sunset:           WeatherComponent.convertDate(curWeather.buienradar[0].zononder[0]),
                moonPhase:        moonPhase.phase,  // Moon phase in days (0..27)
                moonPhaseText:    moonPhase.text,   // Textual description
                moonPhaseWiClass: moonPhase.wicls,  // One of the wi-* classes
            };

        });

        // Update the current radar map URL to reload the image
        this.radarMapUrl = this.weather.getRadarMapUrl();
    }

}
