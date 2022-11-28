import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { ConfigService } from '../_services/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpinnerDirective } from '../_directives/spinner.directive';

/**
 * Mock ConfigService class that returns a specific picture URL.
 */
class MockConfigService implements Partial<ConfigService>{

    get configuration() {
        return {
            chart: {
                refreshRate: undefined,
                url: 'http://greatpics/foo/data.json',
            },
        };
    }
}

describe('ChartComponent', () => {

    let component: ChartComponent;
    let fixture: ComponentFixture<ChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChartComponent, SpinnerDirective],
            imports: [HttpClientTestingModule],
            providers: [
                {provide: ConfigService, useClass: MockConfigService},
            ],
        })
        .compileComponents();

        fixture = TestBed.createComponent(ChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
