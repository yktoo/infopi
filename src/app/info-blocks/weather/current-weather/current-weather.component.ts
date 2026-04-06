import { Component, computed, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { timer } from 'rxjs';
import { TimeAgoPipe } from '../../../core/pipes/time-ago.pipe';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';
import { AstroData, CurrentWeather } from '../models';

@Component({
    selector: 'app-current-weather',
    imports: [
        DatePipe,
        DecimalPipe,
        TruncatePipe,
    ],
    templateUrl: './current-weather.component.html',
    styleUrl: './current-weather.component.scss',
})
export class CurrentWeatherComponent {

    private static readonly moonPhaseMap = [
        {text: 'New',             icon: 'wi-moon-new'},
        {text: 'Waxing crescent', icon: 'wi-moon-waxing-crescent-1'},
        {text: 'Waxing crescent', icon: 'wi-moon-waxing-crescent-2'},
        {text: 'Waxing crescent', icon: 'wi-moon-waxing-crescent-3'},
        {text: 'Waxing crescent', icon: 'wi-moon-waxing-crescent-4'},
        {text: 'Waxing crescent', icon: 'wi-moon-waxing-crescent-5'},
        {text: 'Waxing crescent', icon: 'wi-moon-waxing-crescent-6'},
        {text: 'First quarter',   icon: 'wi-moon-first-quarter'},
        {text: 'Waxing gibbous',  icon: 'wi-moon-waxing-gibbous-1'},
        {text: 'Waxing gibbous',  icon: 'wi-moon-waxing-gibbous-2'},
        {text: 'Waxing gibbous',  icon: 'wi-moon-waxing-gibbous-3'},
        {text: 'Waxing gibbous',  icon: 'wi-moon-waxing-gibbous-4'},
        {text: 'Waxing gibbous',  icon: 'wi-moon-waxing-gibbous-5'},
        {text: 'Waxing gibbous',  icon: 'wi-moon-waxing-gibbous-6'},
        {text: 'Full',            icon: 'wi-moon-full'},
        {text: 'Waning gibbous',  icon: 'wi-moon-waning-gibbous-1'},
        {text: 'Waning gibbous',  icon: 'wi-moon-waning-gibbous-2'},
        {text: 'Waning gibbous',  icon: 'wi-moon-waning-gibbous-3'},
        {text: 'Waning gibbous',  icon: 'wi-moon-waning-gibbous-4'},
        {text: 'Waning gibbous',  icon: 'wi-moon-waning-gibbous-5'},
        {text: 'Waning gibbous',  icon: 'wi-moon-waning-gibbous-6'},
        {text: 'Third quarter',   icon: 'wi-moon-third-quarter'},
        {text: 'Waning crescent', icon: 'wi-moon-waning-crescent-1'},
        {text: 'Waning crescent', icon: 'wi-moon-waning-crescent-2'},
        {text: 'Waning crescent', icon: 'wi-moon-waning-crescent-3'},
        {text: 'Waning crescent', icon: 'wi-moon-waning-crescent-4'},
        {text: 'Waning crescent', icon: 'wi-moon-waning-crescent-5'},
        {text: 'Waning crescent', icon: 'wi-moon-waning-crescent-6'},
    ];

    /** Current weather information. */
    readonly weather = input.required<CurrentWeather>();

    /** Current astronomic data. */
    readonly astro = input.required<AstroData>();

    /** Textual description of the current moon phase. */
    readonly moonPhaseText = computed<string>(() => CurrentWeatherComponent.moonPhaseMap[this.astro().moonPhase].text || '');

    /** One of the wi-* classes picturing the current moon phase. */
    readonly moonPhaseWiClass = computed<string>(() => CurrentWeatherComponent.moonPhaseMap[this.astro().moonPhase].icon || '');

    /** Timer signal to update the "time ago" text (which just changes over time, without a change in the underlying value). */
    private readonly updateTick = toSignal(timer(0, 30 * 1000), {initialValue: 0});

    /** Textual description of the last weather update. */
    readonly updatedTimeAgo = computed<string>(() => {
        this.updateTick();
        return new TimeAgoPipe().transform(this.weather().station.updated);
    });
}
