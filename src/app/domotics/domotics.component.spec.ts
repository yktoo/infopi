import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { DomoticsComponent } from './domotics.component';
import { OpenHabService } from '../_services/open-hab.service';

describe('DomoticsComponent', () => {

    let component: DomoticsComponent;
    let fixture: ComponentFixture<DomoticsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DomoticsComponent],
            providers: [
                {provide: OpenHabService, useValue: MockService(OpenHabService)},
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(DomoticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
