import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OpenHabService } from './open-hab.service';
import { ConfigService } from './config.service';
import { getConfigServiceMock } from '../_testing/services.mock';

describe('OpenHabService', () => {

    let service: OpenHabService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                {
                    provide: ConfigService,
                    useValue: getConfigServiceMock({
                        domotics: {openHabServerUrl: 'http://MyServer:123', refreshRate: 42, showGroup: 'foo'},
                    }),
                },
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

    it('requests and unwraps members', () => {
        service.getItems('MyGroup')
            .subscribe(data => {
                expect(data).toEqual([
                    {type: 'foo', name: 'bar', link: 'boo'},
                    {type: 'baz', name: 'bax', link: 'bux'},
                ]);
            });

        // Mock the HTTP service
        const req = httpTestingController.expectOne('http://MyServer:123/rest/items/MyGroup');

        // Verify request
        expect(req.request.method).toEqual('GET');

        // Respond with test data
        req.flush({
            members: [
                {type: 'foo', name: 'bar', link: 'boo'},
                {type: 'baz', name: 'bax', link: 'bux'},
            ]
        });

        // Verify there's no outstanding request
        httpTestingController.verify();
    });
});
