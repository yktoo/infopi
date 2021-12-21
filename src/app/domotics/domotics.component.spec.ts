import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { DomoticsComponent } from './domotics.component';
import { OpenHabService } from '../_services/open-hab.service';
import { SpinnerDirective } from '../_directives/spinner.directive';

describe('DomoticsComponent', () => {

    let component: DomoticsComponent;
    let fixture: ComponentFixture<DomoticsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DomoticsComponent, SpinnerDirective],
            providers: [
                {provide: OpenHabService, useValue: MockService(OpenHabService)},
            ],
        })
        .compileComponents();

        fixture = TestBed.createComponent(DomoticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
