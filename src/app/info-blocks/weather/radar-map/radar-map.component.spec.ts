import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadarMapComponent } from './radar-map.component';

describe('RadarMapComponent', () => {

    let component: RadarMapComponent;
    let fixture: ComponentFixture<RadarMapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RadarMapComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(RadarMapComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('mapUrl', 'https://example.com/a.jpg');
        fixture.detectChanges();
    });

    it('is created', () => {
        expect(component).toBeTruthy();
    });
});
