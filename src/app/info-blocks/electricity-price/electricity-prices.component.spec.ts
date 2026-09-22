import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import Annotation from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ElectricityPricesComponent } from './electricity-prices.component';

describe('ElectricityPricesComponent', () => {

    let component: ElectricityPricesComponent;
    let fixture: ComponentFixture<ElectricityPricesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ElectricityPricesComponent],
            providers: [provideCharts(withDefaultRegisterables(Annotation, ChartDataLabels))],
        })
            .compileComponents();

        fixture = TestBed.createComponent(ElectricityPricesComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('config', {
            enabled: true,
            refreshRate: 1000,
            supplierId: 10,
        });
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });

    it('renders a chart per day', () => {
        expect(fixture.nativeElement.querySelectorAll('app-electricity-price').length).toBe(2);
    });

    it('unions the ranges reported by the charts', () => {
        expect(component.yRange()).toBeUndefined();

        component.setRange(0, [-0.05, 0.3]);
        expect(component.yRange()).toEqual([-0.05, 0.3]);

        component.setRange(1, [0, 0.42]);
        expect(component.yRange()).toEqual([-0.05, 0.42]);

        // Losing a day's data shrinks the range back
        component.setRange(0, undefined);
        expect(component.yRange()).toEqual([0, 0.42]);
    });
});
