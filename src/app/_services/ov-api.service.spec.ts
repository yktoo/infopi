import { TestBed } from '@angular/core/testing';

import { OvApiService } from './ov-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OvApiService', () => {
    let service: OvApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });
        service = TestBed.inject(OvApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
