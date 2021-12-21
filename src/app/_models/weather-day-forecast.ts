export interface WeatherDayForecast {
    date:            string; // Full date, eg 'zondag 17 april 2016'
    dow:             string; // Day of week
    probSun:         number; // Sun probability in percent
    probSnow:        number; // Snow probability in percent
    rain: {
        probability: number; // Probability in percent
        minAmount:   number; // Minimum amount in mm
        maxAmount:   number; // Maximum amount in mm
    };
    temperature: {
        highMax:     number; // In °C
        highMin:     number; // In °C
        lowMax:      number; // In °C
        lowMin:      number; // In °C
    };
    wind: {
        dirText:     string; // Text, like 'WZW'
        speed:       number; // In bft
    };
    icon: {
        url:         string;
        wiClass:     string;
    };
}
