import { TestBed } from '@angular/core/testing';

import { OvApiService } from './ov-api.service';

describe('OvApiService', () => {
    let service: OvApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OvApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
