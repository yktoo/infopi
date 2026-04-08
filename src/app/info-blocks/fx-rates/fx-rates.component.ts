import { Component, computed, effect, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { FxRatesConfig } from '../../core/config/config';
import { XmlParserService } from '../../core/xml-parser/xml-parser.service';
import { RawEcbFxResponse, FxRate, RawFxRateCube } from './models';

@Component({
    selector: 'app-fx-rates',
    templateUrl: './fx-rates.component.html',
    styleUrls: ['./fx-rates.component.scss'],
    imports: [
        DecimalPipe,
        SpinnerDirective,
    ],
})
export class FxRatesComponent {

    private readonly xmlParser = inject(XmlParserService);

    /** Component configuration. */
    readonly config = input.required<FxRatesConfig>();

    /** FX rates resource. */
    readonly fxrResource = httpResource.text(() => 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml');

    /** FX rates being displayed. */
    readonly fxRates = computed<FxRate[] | undefined>(() => {
        if (!this.fxrResource.hasValue()) {
            return undefined;
        }

        // Extract current and previous rates into maps indexed by the currency symbol
        const cfg = this.config();
        const fxData = this.xmlParser.parse<RawEcbFxResponse>(this.fxrResource.value())['gesmes:Envelope'];
        const ratesCurrent  = this.getCurrencyRates(cfg.baseCurrency, fxData.Cube.Cube[0].Cube);
        const ratesPrevious = this.getCurrencyRates(cfg.baseCurrency, fxData.Cube.Cube[1].Cube);

        // Filter the currencies and calculate moves
        return Object.entries(cfg.showCurrencies)
            .map<FxRate>(([currency, symbol]) => ({
                currency,
                rate: ratesCurrent[currency],
                move: currency in ratesCurrent && currency in ratesPrevious ? Math.abs(ratesCurrent[currency] - ratesPrevious[currency]) : 0,
                symbol,
            }));
    });

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.fxrResource.reload());
            onCleanup(() => t.unsubscribe());
        });
    }

    private getCurrencyRates(base: string, input: RawFxRateCube[]): Record<string, number> {
        const result = input.reduce(
            (acc, val) => {
                acc[val.attr.currency] = Number(val.attr.rate);
                return acc;
            },
            {} as Record<string, number>);

        // Euro is the base currency, so we need to add it manually
        result.EUR = 1.0;

        // Recalibrate all rates to the base currency
        if (base !== 'EUR') {
            const baseRate = result[base];
            Object.entries(result).forEach(([curr, rate]) => result[curr] = baseRate / rate);
        }
        return result;
    }
}
