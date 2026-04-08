import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FxRatesComponent } from './fx-rates.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FxRatesComponent', () => {

    let component: FxRatesComponent;
    let fixture: ComponentFixture<FxRatesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FxRatesComponent],
            providers: [
                provideHttpClientTesting(),
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(FxRatesComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('config', {
            enabled: true,
            refreshRate: 1000,
            baseCurrency: 'EUR',
            showCurrencies: {USD: '$', GBP: '£'},
        });
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
