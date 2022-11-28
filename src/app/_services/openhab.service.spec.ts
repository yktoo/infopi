import { TestBed } from '@angular/core/testing';

import { OpenHabService } from './open-hab.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from './config.service';

describe('OpenHabService', () => {

    let service: OpenHabService;
    let httpTestingController: HttpTestingController;

    /**
     * Mock ConfigService class that returns a specific server URL.
     */
    class MockConfigService {

        get configuration() {
            return {
                domotics: {
                    openHabServerUrl: 'http://MyServer:123',
                },
            };
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
        service = TestBed.inject(OpenHabService);
    });

    it('is created', () => {
        expect(service).toBeTruthy();
    });

    it('getItems requests and unwraps items', () => {
        service.getItems('MyGroup')
            .subscribe(data => {
                expect(data).toEqual([
                    {foo: 'bar'},
                    {zoo: 'baz'},
                ]);
            });

        // Mock the HTTP service
        const req = httpTestingController.expectOne('http://MyServer:123/rest/items/MyGroup');

        // Verify request
        expect(req.request.method).toEqual('GET');

        // Respond with test data
        req.flush({
            members: [
                {foo: 'bar'},
                {zoo: 'baz'},
            ]
        });

        // Verify there's no outstanding request
        httpTestingController.verify();
    });

});
