import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FxComponent } from './fx.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FxComponent', () => {

    let component: FxComponent;
    let fixture: ComponentFixture<FxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FxComponent],
            providers: [
                provideHttpClientTesting(),
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
