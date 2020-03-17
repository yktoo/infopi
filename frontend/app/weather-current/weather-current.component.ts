import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../_services/weather.service';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';

@Component({
    selector: 'app-weather-current',
    templateUrl: './weather-current.component.html',
    styleUrls: ['./weather-current.component.scss']
})
export class WeatherCurrentComponent implements OnInit {

    currentWeather: any;
    weatherMessage: string;

    iconToWiClassMap = {
        // Day
        a: 'wi-day-sunny',
        b: 'wi-day-sunny-overcast',
        c: 'wi-cloud',
        d: 'wi-day-cloudy-windy',
        e: 'wi-day-fog',
        f: 'wi-day-sprinkle',
        g: 'wi-day-thunderstorm',
        h: 'wi-day-rain',
        i: 'wi-day-rain',
        j: 'wi-day-sunny-overcast',
        k: 'wi-day-showers',
        l: 'wi-day-sleet',
        m: 'wi-sleet',
        n: 'wi-snowflake-cold',
        o: 'wi-day-cloudy',
        p: 'wi-cloud',
        q: 'wi-sleet',
        r: 'wi-day-cloudy',
        s: 'wi-day-sleet-storm',
        t: 'wi-snow',
        u: 'wi-day-snow',
        v: 'wi-sleet',
        w: 'wi-rain-mix',
        x: 'wi-snow',
        y: 'wi-snow-wind',
        z: 'wi-snow-wind',
        // Night
        aa: 'wi-night-clear',
        bb: 'wi-night-partly-cloudy',
        cc: 'wi-night-cloudy',
        dd: 'wi-night-alt-cloudy-windy',
        ee: 'wi-night-fog',
        ff: 'wi-night-sprinkle',
        gg: 'wi-night-alt-thunderstorm',
        hh: 'wi-night-rain',
        ii: 'wi-night-alt-rain',
        jj: 'wi-night-alt-cloudy',
        kk: 'wi-night-alt-showers',
        ll: 'wi-night-alt-sleet',
        mm: 'wi-sleet',
        nn: 'wi-snowflake-cold',
        oo: 'wi-night-cloudy',
        pp: 'wi-cloud',
        qq: 'wi-sleet',
        rr: 'wi-night-alt-cloudy',
        ss: 'wi-night-alt-sleet-storm',
        tt: 'wi-snow',
        uu: 'wi-night-alt-snow',
        vv: 'wi-sleet',
        ww: 'wi-rain-mix',
        xx: 'wi-snow',
        yy: 'wi-snow-wind',
        zz: 'wi-snow-wind',
    };


constructor(private weather: WeatherService, private config: ConfigService) { }

    ngOnInit(): void {
        timer(1, 10*60*1000).subscribe(() => this.update());
    }

    update() {
        this.weather.getWeather().subscribe(data => {
            // Find the desired weather station by its ID
            const id = this.config.buienRadarStationId;
            let weather = data.actueel_weer[0].weerstations[0].weerstation.find(e => e.$.id === id);

            if (weather) {
                // Parse and identify the weather icon
                let icon = weather.icoonactueel[0].$;
                weather.icon = {
                    wiClass: this.iconToWiClassMap[icon.ID] || 'wi-na',
                    text: icon.zin
                };
            }

            // Pick the weather message
            weather.message = data.verwachting_vandaag[0].samenvatting;

            this.currentWeather = weather;
        });
    }

}
