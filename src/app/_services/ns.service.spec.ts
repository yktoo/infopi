import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { NsService } from './ns.service';
import { ConfigService } from './config.service';
import { getConfigServiceMock } from '../_testing/services.mock';

describe('NsService', () => {

    const baseUrl = 'PROXY:https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/';

    let service: NsService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {provide: ConfigService, useValue: getConfigServiceMock({api: {nsApiKey: 'SECRET_NS_API_KEY'}})},
            ],
        });

        // Inject the HTTP test controller for each test
        httpTestingController = TestBed.inject(HttpTestingController);

        // Instantiate service under test
        service = TestBed.inject(NsService);
    });

    it('is created', () => {
        expect(service).toBeTruthy();
    });

    it('getDepartureTimes requests and unwraps train departure times', () => {
        service.getDepartureTimes('Chelsea')
            .subscribe(data => {
                expect(data[0].name).toEqual('foo');
            });

        // Mock the HTTP service
        const req = httpTestingController.expectOne(
            rq => rq.url.startsWith(baseUrl + 'departures')
        );

        // Verify request
        expect(req.request.method).toEqual('GET');
        expect(req.request.headers.get('Ocp-Apim-Subscription-Key')).toEqual('SECRET_NS_API_KEY');
        expect(req.request.headers.get('Content-Type')).toEqual('application/json');
        expect(req.request.params.get('station')).toEqual('Chelsea');

        // Respond with test data
        req.flush({
            payload: {
                departures: [{
                    name: 'foo'
                }],
            }
        });

        // Verify there's no outstanding request
        httpTestingController.verify();
    });
});
