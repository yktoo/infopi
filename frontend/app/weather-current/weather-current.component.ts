import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../_services/weather.service';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-weather-current',
    templateUrl: './weather-current.component.html',
    styleUrls: ['./weather-current.component.scss']
})
export class WeatherCurrentComponent implements OnInit {

    currentWeather: any;
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
            let station = curWeather.weerstations[0].weerstation.find(e => e.$.id === id);

            if (station) {
                // Parse and identify the weather icon
                let icon = station.icoonactueel[0].$;
                station.icon = {
                    wiClass: this.weather.getWeatherIconClass(icon.ID),
                    text: icon.zin
                };
            }

            // Pick the weather message
            station.message = data.verwachting_vandaag[0].samenvatting;

            // Add sunrise and sunset
            station.sunrise = WeatherCurrentComponent.convertDate(curWeather.buienradar[0].zonopkomst[0]);
            station.sunset  = WeatherCurrentComponent.convertDate(curWeather.buienradar[0].zononder[0]);

            // Add moon phase
            // TODO
            this.currentWeather = station;
        });

        // Update the current radar map URL to reload the image
        this.radarMapUrl = this.weather.getRadarMapUrl();
    }

}
