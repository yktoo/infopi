import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { FxComponent } from './fx.component';
import { FxService } from '../_services/fx.service';

describe('FxComponent', () => {

    let component: FxComponent;
    let fixture: ComponentFixture<FxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FxComponent],
            providers: [
                {provide: FxService, useValue: MockService(FxService)},
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(FxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
