import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { TrainComponent } from './train.component';
import { NsService } from '../_services/ns.service';
import { SpinnerDirective } from '../_directives/spinner.directive';

describe('TrainComponent', () => {
    let component: TrainComponent;
    let fixture: ComponentFixture<TrainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TrainComponent, SpinnerDirective],
            providers: [
                {provide: NsService, useValue: MockService(NsService)},
            ],
        })
        .compileComponents();

        fixture = TestBed.createComponent(TrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
