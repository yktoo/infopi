import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicComponent } from './pic.component';
import { ConfigService } from '../_services/config.service';

describe('PicComponent', () => {
    let component: PicComponent;
    let fixture: ComponentFixture<PicComponent>;

    /**
     * Mock ConfigService class that returns a specific picture URL.
     */
    class MockConfigService {

        get configuration() {
            return {
                pic: {
                    refreshRate: undefined,
                    url: 'http://greatpics/foo/mypic.jpg',
                },
            };
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PicComponent ],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PicComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should generate a picture URL', () => {
        component.update();
        expect(component.picUrl).toBeTruthy();
    });
});
