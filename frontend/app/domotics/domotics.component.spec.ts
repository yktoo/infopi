import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomoticsComponent } from './domotics.component';

describe('DomoticsComponent', () => {
    let component: DomoticsComponent;
    let fixture: ComponentFixture<DomoticsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DomoticsComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DomoticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
