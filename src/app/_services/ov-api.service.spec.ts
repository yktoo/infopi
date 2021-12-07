import { TestBed } from '@angular/core/testing';

import { OvApiService } from './ov-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('OvApiService', () => {

    let service: OvApiService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });

        // Inject the HTTP test controller for each test
        httpTestingController = TestBed.inject(HttpTestingController);

        // Instantiate service under test
        service = TestBed.inject(OvApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getDepartureTimes() should request and unwrap departure times', () => {
        service.getDepartureTimes('zazzoo').subscribe(data => expect(data).toEqual({foo: 'bar'}));

        // Mock the HTTP service
        const req = httpTestingController.expectOne('https://v0.ovapi.nl/stopareacode/zazzoo');

        // Verify request method
        expect(req.request.method).toEqual('GET');

        // Respond with test data
        req.flush({
            zazzoo: {
                foo: 'bar',
            }
        });

        // Verify there's no outstanding request
        httpTestingController.verify();
    });

});
