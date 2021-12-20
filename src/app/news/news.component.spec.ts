import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NewsComponent } from './news.component';

describe('NewsComponent', () => {
    let component: NewsComponent;
    let fixture: ComponentFixture<NewsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewsComponent],
            imports: [HttpClientTestingModule],
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
