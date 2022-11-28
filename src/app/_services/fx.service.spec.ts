import { TestBed } from '@angular/core/testing';

import { FxService } from './fx.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from './config.service';

describe('FxService', () => {

    const url = 'PROXY:https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';

    let service: FxService;
    let httpTestingController: HttpTestingController;

    /**
     * Mock ConfigService class that returns a fixed CORS proxy config string.
     */
    class MockConfigService {
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
        service = TestBed.inject(FxService);
    });

    it('is created', () => {
        expect(service).toBeTruthy();
    });

    it('getFxRates requests and unwraps rates', () => {
        service.getFxRates()
            .subscribe(data => {
                expect(data.A).toEqual(['foo']);
                expect(data.B).toEqual(['bar']);
            });

        // Mock the HTTP service
        const req = httpTestingController.expectOne(url);

        // Verify request method
        expect(req.request.method).toEqual('GET');

        // Respond with test data
        req.flush(
            '<gesmes:Envelope xmlns:gesmes="xxx" xmlns="yyy">' +
                '<A>foo</A>' +
                '<B>bar</B>' +
            '</gesmes:Envelope>');

        // Verify there's no outstanding request
        httpTestingController.verify();
    });
});
