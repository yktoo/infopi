import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BusComponent } from './bus.component';

describe('BusComponent', () => {
    let component: BusComponent;
    let fixture: ComponentFixture<BusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BusComponent],
            imports: [
                HttpClientTestingModule,
            ],
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
