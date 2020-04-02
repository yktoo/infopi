import { TestBed } from '@angular/core/testing';

import { BuienradarService } from './buienradar.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BuienradarService', () => {
    let service: BuienradarService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });
        service = TestBed.inject(BuienradarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
