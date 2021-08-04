import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { ConfigService } from '../_services/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChartComponent', () => {
    let component: ChartComponent;
    let fixture: ComponentFixture<ChartComponent>;

    /**
     * Mock ConfigService class that returns a specific picture URL.
     */
    class MockConfigService {

        get configuration() {
            return {
                chart: {
                    refreshRate: undefined,
                    url: 'http://greatpics/foo/data.json',
                },
            };
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ChartComponent],
            imports: [HttpClientTestingModule],
            providers: [
                {provide: ConfigService, useClass: MockConfigService},
            ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
