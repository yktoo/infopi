import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../_services/weather.service';
import { ConfigService } from '../_services/config.service';

@Component({
    selector: 'app-weather-current',
    templateUrl: './weather-current.component.html',
    styleUrls: ['./weather-current.component.scss']
})
export class WeatherCurrentComponent implements OnInit {

    currentWeather: any;

    constructor(private weather: WeatherService, private config: ConfigService) { }

    ngOnInit(): void {
    }

    update() {
        this.weather.getWeather().subscribe(data => {
            this.currentWeather = data.actueel_weer[0].weerstations[0].weerstation.keys()
                .find(st => st.id === this.config.buienRadarStationId);
            console.log(this.currentWeather);
            console.log(typeof this.currentWeather);
        });
    }

}
