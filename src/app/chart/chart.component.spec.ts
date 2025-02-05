import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChartComponent } from './chart.component';
import { ConfigService } from '../_services/config.service';
import { getConfigServiceMock } from '../_testing/services.mock';

describe('ChartComponent', () => {

    let component: ChartComponent;
    let fixture: ComponentFixture<ChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChartComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: ConfigService,
                    useValue: getConfigServiceMock({chart: {maxElements: 7, refreshRate: 42, url: 'http://greatpics/foo/data.json'}}),
                },
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
