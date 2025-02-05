import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { OvApiService } from './ov-api.service';

describe('OvApiService', () => {

    let service: OvApiService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        // Inject the HTTP test controller for each test
        httpTestingController = TestBed.inject(HttpTestingController);

        // Instantiate service under test
        service = TestBed.inject(OvApiService);
    });

    it('is created', () => {
        expect(service).toBeTruthy();
    });

    it('getDepartureTimes requests and unwraps departure times', () => {
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
