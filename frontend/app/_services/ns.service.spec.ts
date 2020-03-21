import { TestBed } from '@angular/core/testing';

import { NsService } from './ns.service';

describe('NsService', () => {
    let service: NsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
