import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { FxComponent } from './fx.component';
import { FxService } from '../_services/fx.service';
import { SpinnerDirective } from '../_directives/spinner.directive';

describe('FxComponent', () => {

    let component: FxComponent;
    let fixture: ComponentFixture<FxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FxComponent, SpinnerDirective],
            providers: [
                {provide: FxService, useValue: MockService(FxService)},
            ],
        })
        .compileComponents();

        fixture = TestBed.createComponent(FxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
