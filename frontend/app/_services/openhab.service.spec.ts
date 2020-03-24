import { TestBed } from '@angular/core/testing';

import { OpenhabService } from './openhab.service';

describe('OpenhabService', () => {
    let service: OpenhabService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OpenhabService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
