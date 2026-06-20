import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectricityPriceComponent } from './electricity-price.component';

describe('ElectricityPriceComponent', () => {

    let component: ElectricityPriceComponent;
    let fixture: ComponentFixture<ElectricityPriceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ElectricityPriceComponent],
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
