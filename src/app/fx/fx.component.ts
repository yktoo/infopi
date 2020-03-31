import { Component, OnInit } from '@angular/core';
import { FxService } from '../_services/fx.service';
import { ConfigService } from '../_services/config.service';
import { timer } from 'rxjs';

class Rate {
    constructor(public currency: string, public rate: number, public move: number, public symbol: string) { }
}

@Component({
    selector: 'app-fx',
    templateUrl: './fx.component.html',
    styleUrls: ['./fx.component.scss']
})
export class FxComponent implements OnInit {

    fxRates: Rate[];
    error: any;

    constructor(private config: ConfigService, private fx: FxService) { }

    ngOnInit(): void {
        timer(0, this.config.configuration.fx.refreshRate).subscribe(() => this.update());
    }

    private getCurrencyRates(input: any[]): Map<string, number> {
        const result = new Map();

        // Convert the array into a map
        input.forEach(e => result.set(e.$.currency, Number(e.$.rate).valueOf()));

        // Euro is the base currency, so we need to add it manually
        result.set('EUR', 1.0);

        // Recalibrate all rates to the base currency
        const base = this.config.configuration.fx.baseCurrency;
        if (base !== 'EUR') {
            const baseRate = result.get(base);
            result.forEach((rate, currency, map) => map.set(currency, baseRate / rate));
        }
        return result;
    }

    update() {
        this.fx.getFxRates()
            .subscribe(
                data => {
                    // Extract current and previous rates into maps indexed by the currency symbol
                    const ratesCurrent  = this.getCurrencyRates(data.Cube[0].Cube[0].Cube);
                    const ratesPrevious = this.getCurrencyRates(data.Cube[0].Cube[1].Cube);

                    // Filter the currencies and calculate moves
                    const currConfig = this.config.configuration.fx.showCurrencies;
                    const rates = [];
                    Object.keys(currConfig).forEach(c => {
                        let move = null;
                        if (ratesCurrent.has(c) && ratesPrevious.has(c)) {
                            move = Math.abs(ratesCurrent.get(c) - ratesPrevious.get(c));
                        }
                        rates.push(new Rate(c, ratesCurrent.get(c), move, currConfig[c]));
                    });
                    this.fxRates = rates;
                    this.error = undefined;
                },
                error => this.error = error);

    }
}
