import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectricityPriceComponent } from './electricity-price.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import Annotation from 'chartjs-plugin-annotation';

describe('ElectricityPriceComponent', () => {

    let component: ElectricityPriceComponent;
    let fixture: ComponentFixture<ElectricityPriceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ElectricityPriceComponent],
            providers: [provideCharts(withDefaultRegisterables(Annotation))],
        })
            .compileComponents();

        fixture = TestBed.createComponent(ElectricityPriceComponent);
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
});
