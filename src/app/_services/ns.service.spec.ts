import { TestBed } from '@angular/core/testing';

import { NsService } from './ns.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NsService', () => {
    let service: NsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });
        service = TestBed.inject(NsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
