import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../_services/weather.service';

@Component({
    selector: 'app-weather-current',
    templateUrl: './weather-current.component.html',
    styleUrls: ['./weather-current.component.scss']
})
export class WeatherCurrentComponent implements OnInit {

    currentWeather: any;

    constructor(private weather: WeatherService) { }

    ngOnInit(): void {
    }

    update() {
        this.weather.getWeather().subscribe(data => {
            console.log(data);
            this.currentWeather = data;
        });
    }

}
