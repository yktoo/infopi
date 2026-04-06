import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { HomeAutomationComponent } from './home-automation.component';
import { OpenHabService } from '../_services/open-hab.service';

describe('DomoticsComponent', () => {

    let component: HomeAutomationComponent;
    let fixture: ComponentFixture<HomeAutomationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeAutomationComponent],
            providers: [
                {provide: OpenHabService, useValue: MockService(OpenHabService)},
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
