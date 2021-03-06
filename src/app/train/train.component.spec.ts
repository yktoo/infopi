import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrainComponent } from './train.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TrainComponent', () => {
    let component: TrainComponent;
    let fixture: ComponentFixture<TrainComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            declarations: [ TrainComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
