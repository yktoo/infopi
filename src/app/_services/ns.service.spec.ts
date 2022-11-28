import { TestBed } from '@angular/core/testing';

import { NsService } from './ns.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from './config.service';

describe('NsService', () => {

    const baseUrl = 'PROXY:https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/';

    let service: NsService;
    let httpTestingController: HttpTestingController;

    /**
     * Mock ConfigService class that returns a fixed CORS proxy config string and API key.
     */
    class MockConfigService {

        get configuration() {
            return {
                api: {
                    nsApiKey: 'SECRET_NS_API_KEY',
                }
            };
        }

        get corsProxy() {
            return 'PROXY:';
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
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
