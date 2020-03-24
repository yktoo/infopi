import { TestBed } from '@angular/core/testing';

import { BuienradarService } from './buienradar.service';

describe('BuienradarService', () => {
    let service: BuienradarService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BuienradarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
