import { TestBed } from '@angular/core/testing';
import { XmlParserService } from './xml-parser.service';

describe('XmlParserService', () => {

    let service: XmlParserService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(XmlParserService);
    });

    it('is created', () => {
        expect(service).toBeTruthy();
    });
});
