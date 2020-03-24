import { TestBed } from '@angular/core/testing';

import { FxService } from './fx.service';

describe('FxService', () => {
    let service: FxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
