import { TestBed } from '@angular/core/testing';

import { RssService } from './rss.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RssService', () => {
    let service: RssService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });
        service = TestBed.inject(RssService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
