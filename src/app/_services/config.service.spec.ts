import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
    let service: ConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfigService);
    });

    it('is created', () => {
        expect(service).toBeTruthy();
    });

    it('has configuration object', () => {
        const config = service.configuration;
        expect(config).toEqual(jasmine.any(Object));

        // API
        expect(config.api).toEqual(jasmine.any(Object));
        expect(config.api.nsApiKey).toEqual(jasmine.any(String));

        // Refresh rates
        expect(config.clock.refreshRate).toBeGreaterThan(0);
        expect(config.weather.refreshRate).toBeGreaterThan(0);
        expect(config.trains.refreshRate).toBeGreaterThan(0);
        expect(config.busses.refreshRate).toBeGreaterThan(0);
        expect(config.fx.refreshRate).toBeGreaterThan(0);
        expect(config.domotics.refreshRate).toBeGreaterThan(0);
        expect(config.rss.refreshRate).toBeGreaterThan(0);
    });

    it('returns CORS proxy string', () => {
        const corsProxy = service.corsProxy;
        expect(corsProxy).toEqual(jasmine.any(String));
    });
});
