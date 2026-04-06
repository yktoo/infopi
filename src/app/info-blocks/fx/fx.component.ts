import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { timer } from 'rxjs';
import { DataLoading, loadsDataInto } from '../../core/data-loading';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { APP_CONFIG } from '../../core/config/config';
import { HttpClient } from '@angular/common/http';
import { XmlParserService } from '../../core/xml-parser/xml-parser.service';

interface FxBasic {
    'gesmes:Envelope': any;
}

class Rate {
    constructor(public currency: string, public rate: number, public move: number, public symbol: string) { }
}

@Component({
    selector: 'app-fx',
    templateUrl: './fx.component.html',
    styleUrls: ['./fx.component.scss'],
    imports: [
        DecimalPipe,
        SpinnerDirective,
    ],
})
export class FxComponent implements OnInit, DataLoading {

    private static baseUrl = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';

    private readonly config = inject(APP_CONFIG).fxRates;
    private readonly http = inject(HttpClient);
    private readonly xmlParser = inject(XmlParserService);

    fxRates: Rate[];
    error: any;
    dataLoading = false;

    ngOnInit(): void {
        timer(0, this.config.refreshRate).subscribe(() => this.update());
    }

    update() {
        // Request FX rates and return them wrapped in an Observable
        this.http.get(FxComponent.baseUrl, {responseType: 'text'})
            .pipe(loadsDataInto(this))
            .subscribe({
                // Parse the XML response and process the data
                next:  d => this.processData(d),
                error: error => this.error = error,
            });
    }

    private processData(data: any) {
        // Remove any error
        this.error = undefined;

        // Extract current and previous rates into maps indexed by the currency symbol
        const fxData = this.xmlParser.parse<FxBasic>(data)['gesmes:Envelope'];
        const ratesCurrent  = this.getCurrencyRates(fxData.Cube[0].Cube[0].Cube);
        const ratesPrevious = this.getCurrencyRates(fxData.Cube[0].Cube[1].Cube);

        // Filter the currencies and calculate moves
        const currConfig = this.config.showCurrencies;
        this.fxRates = [];
        Object.keys(currConfig).forEach(c => {
            let move = null;
            if (ratesCurrent.has(c) && ratesPrevious.has(c)) {
                move = Math.abs(ratesCurrent.get(c) - ratesPrevious.get(c));
            }
            this.fxRates.push(new Rate(c, ratesCurrent.get(c), move, currConfig[c]));
        });
    }

    private getCurrencyRates(input: any[]): Map<string, number> {
        const result = new Map();

        // Convert the array into a map
        input.forEach(e => result.set(e.$.currency, Number(e.$.rate).valueOf()));

        // Euro is the base currency, so we need to add it manually
        result.set('EUR', 1.0);

        // Recalibrate all rates to the base currency
        const base = this.config.baseCurrency;
        if (base !== 'EUR') {
            const baseRate = result.get(base);
            result.forEach((rate, currency, map) => map.set(currency, baseRate / rate));
        }
        return result;
    }
}
