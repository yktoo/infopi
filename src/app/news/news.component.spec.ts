import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { NewsComponent } from './news.component';
import { RssService } from '../_services/rss.service';
import { SpinnerDirective } from '../_directives/spinner.directive';

describe('NewsComponent', () => {
    let component: NewsComponent;
    let fixture: ComponentFixture<NewsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewsComponent, SpinnerDirective],
            providers: [
                {provide: RssService, useValue: MockService(RssService)},
            ],
        })
        .compileComponents();

        fixture = TestBed.createComponent(NewsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
