import { TestBed } from '@angular/core/testing';

import { FxService } from './fx.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FxService', () => {
    let service: FxService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });
        service = TestBed.inject(FxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
