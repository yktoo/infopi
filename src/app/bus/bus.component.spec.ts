import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { BusComponent } from './bus.component';
import { OvApiService } from '../_services/ov-api.service';
import { SpinnerDirective } from '../_directives/spinner.directive';

describe('BusComponent', () => {

    let component: BusComponent;
    let fixture: ComponentFixture<BusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BusComponent, SpinnerDirective],
            providers: [{provide: OvApiService, useValue: MockService(OvApiService)}],
        })
        .compileComponents();

        fixture = TestBed.createComponent(BusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
