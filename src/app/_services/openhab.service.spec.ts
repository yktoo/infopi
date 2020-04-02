import { TestBed } from '@angular/core/testing';

import { OpenhabService } from './openhab.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OpenhabService', () => {
    let service: OpenhabService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });
        service = TestBed.inject(OpenhabService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
