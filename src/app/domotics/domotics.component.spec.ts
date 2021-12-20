import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DomoticsComponent } from './domotics.component';

describe('DomoticsComponent', () => {
    let component: DomoticsComponent;
    let fixture: ComponentFixture<DomoticsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DomoticsComponent],
            imports: [HttpClientTestingModule],
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
