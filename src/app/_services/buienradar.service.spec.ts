import { TestBed } from '@angular/core/testing';

import { BuienradarService } from './buienradar.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('BuienradarService', () => {
    const url = 'https://data.buienradar.nl/1.0/feed/xml';

    let service: BuienradarService;
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
        service = TestBed.inject(BuienradarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getWeather() should request weather info', () => {
        service.getWeather()
            .subscribe(data => {
                expect(data.A).toEqual(['value']);
                expect(data.B[0].a).toEqual(['foo', 'bar']);
            });

        // Mock the Buienradar URL
        const req = httpTestingController.expectOne(url);

        // Verify request method
        expect(req.request.method).toEqual('GET');

        // Respond with test data
        req.flush(
            '<buienradarnl><weergegevens>' +
                '<A>value</A>' +
                '<B>' +
                    '<a>foo</a>' +
                    '<a>bar</a>' +
                '</B>' +
            '</weergegevens></buienradarnl>');

        // Verify there's no outstanding request
        httpTestingController.verify();
    });

    it('#getWeatherIconClass() should translate Buienradar icons', () => {
        expect(service.getWeatherIconClass('h')).toEqual('wi-day-rain');
        expect(service.getWeatherIconClass('o')).toEqual('wi-day-cloudy');
        expect(service.getWeatherIconClass('hh')).toEqual('wi-night-rain');
        expect(service.getWeatherIconClass('oo')).toEqual('wi-night-cloudy');
    });

    it('#getWeatherIconClass() should return wi-na on an unknown icon', () => {
        expect(service.getWeatherIconClass('bazooka')).toEqual('wi-na');
    });

    it('#getRadarMapUrl() should return a sanitised Buienradar URL', () => {
        const mapUrl = service.getRadarMapUrl();
        expect(mapUrl.toString()).toContain('https://gadgets.buienradar.nl/gadget/zoommap/');
    });

    it('#getRadarMapUrl() should return a randomised Buienradar URL', () => {
        const mapUrl = new Set<string>();
        for (let i = 0; i < 5; i++) {
            mapUrl.add(service.getRadarMapUrl().toString());
        }
        expect(mapUrl.size).toEqual(5);
    });

    it('#getMoonPhase() should return New on 24 January 2020 at 22:24', () => {
        jasmine.clock().mockDate(new Date('2020-01-24 22:24'));
        expect(service.getMoonPhase()).toEqual({
            phase: 0,
            text: 'New',
            wicls: 'wi-moon-new'
        });
    });

    it('#getMoonPhase() should return Full on 10 January 2020 at 20:23', () => {
        jasmine.clock().mockDate(new Date('2020-01-10 20:23'));
        expect(service.getMoonPhase()).toEqual({
            phase: 14,
            text: 'Full',
            wicls: 'wi-moon-full'
        });
    });

    it('#getMoonPhase() should return First Quarter on 27 July 2020 at 14:33', () => {
        jasmine.clock().mockDate(new Date('2020-07-27 14:33'));
        expect(service.getMoonPhase()).toEqual({
            phase: 7,
            text: 'First quarter',
            wicls: 'wi-moon-first-quarter'
        });
    });

    it('#getMoonPhase() should return Third Quarter on 8 December 2020 at 01:37', () => {
        jasmine.clock().mockDate(new Date('2020-12-08 01:37'));
        expect(service.getMoonPhase()).toEqual({
            phase: 21,
            text: 'Third quarter',
            wicls: 'wi-moon-third-quarter'
        });
    });

});
