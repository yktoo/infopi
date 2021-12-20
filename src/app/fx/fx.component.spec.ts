import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FxComponent } from './fx.component';

describe('FxComponent', () => {

    let component: FxComponent;
    let fixture: ComponentFixture<FxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FxComponent],
            imports: [HttpClientTestingModule],
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
