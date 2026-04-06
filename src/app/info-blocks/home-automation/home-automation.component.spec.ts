import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HomeAutomationComponent } from './home-automation.component';

describe('DomoticsComponent', () => {

    let component: HomeAutomationComponent;
    let fixture: ComponentFixture<HomeAutomationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeAutomationComponent],
            providers: [
                provideHttpClientTesting(),
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(HomeAutomationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
