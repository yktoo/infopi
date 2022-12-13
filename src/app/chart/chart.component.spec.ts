import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { ConfigService } from '../_services/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpinnerDirective } from '../_directives/spinner.directive';
import { getConfigServiceMock } from '../_testing/services.mock';

describe('ChartComponent', () => {

    let component: ChartComponent;
    let fixture: ComponentFixture<ChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChartComponent, SpinnerDirective],
            imports: [HttpClientTestingModule],
            providers: [
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
