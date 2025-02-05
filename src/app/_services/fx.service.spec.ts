import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FxService } from './fx.service';
import { ConfigService } from './config.service';
import { getConfigServiceMock } from '../_testing/services.mock';

describe('FxService', () => {

    const url = 'PROXY:https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';

    let service: FxService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {provide: ConfigService, useValue: getConfigServiceMock()},
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
                expect(data.A.text).toEqual('foo');
                expect(data.B.text).toEqual('bar');
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
