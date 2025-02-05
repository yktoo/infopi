import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RssService } from './rss.service';
import { ConfigService } from './config.service';
import { getConfigServiceMock } from '../_testing/services.mock';

describe('RssService', () => {

    let service: RssService;
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
        service = TestBed.inject(RssService);
    });

    it('is created', () => {
        expect(service).toBeTruthy();
    });

    it('getRssItems requests and unwraps RSS feed', () => {
        const url = 'https://super-rss-feed.com/rss.xml';
        service.getRssItems(url)
            .subscribe(data => {
                expect(data.title.text).toEqual('Superfeed');
                expect(data.item).toEqual([
                    {
                        title:       {text: 'Super post'},
                        link:        {text: 'https://the-link.com'},
                        description: {text: 'This is the best post'},
                    },
                    {
                        title:       {text: 'Next post'},
                        link:        {text: 'https://the-link-2.com'},
                        description: {text: 'This is the next best post'},
                    },
                ]);
            });

        // Mock the HTTP service
        const req = httpTestingController.expectOne('PROXY:' + url);

        // Verify request method
        expect(req.request.method).toEqual('GET');

        // Respond with test data
        req.flush(
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<rss version="2.0">' +
                '<channel>' +
                    '<title>Superfeed</title>' +
                    '<item>' +
                        '<title>Super post</title>' +
                        '<link>https://the-link.com</link>' +
                        '<description>This is the best post</description>' +
                    '</item>' +
                    '<item>' +
                        '<title>Next post</title>' +
                        '<link>https://the-link-2.com</link>' +
                        '<description>This is the next best post</description>' +
                    '</item>' +
                '</channel>' +
            '</rss>');

        // Verify there's no outstanding request
        httpTestingController.verify();
    });

    // TODO atom feeds
    xit('getRssItems requests and unwraps Atom feed', () => {
        const url = 'https://super-atom-feed.com/atom.xml';
        service.getRssItems(url)
            .subscribe(data => {
                expect(data.title.text).toEqual('Atomfeed');
                expect((data as any).entry).toEqual([
                    {
                        title: ['Super Atom Post'],
                        link: [{
                            $: {href: 'http://atom-link-03'}
                        }],
                        id: ['C0FFEE'],
                        summary: ['Summary text'],
                    },
                    {
                        title: ['Mega Atom Post'],
                        link: [{
                            $: {href: 'http://atom-link-33'}
                        }],
                        id: ['aBBa'],
                        summary: ['Lots of info'],
                    },
                ]);
            });

        // Mock the HTTP service
        const req = httpTestingController.expectOne('PROXY:' + url);

        // Verify request method
        expect(req.request.method).toEqual('GET');

        // Respond with test data
        req.flush(
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<feed xmlns="http://www.w3.org/2005/Atom">' +
                '<title>Atomfeed</title>' +
                '<entry>' +
                    '<title>Super Atom Post</title>' +
                    '<link href="http://atom-link-03"/>' +
                    '<id>C0FFEE</id>' +
                    '<summary>Summary text</summary>' +
                '</entry>' +
                '<entry>' +
                    '<title>Mega Atom Post</title>' +
                    '<link href="http://atom-link-33"/>' +
                    '<id>aBBa</id>' +
                    '<summary>Lots of info</summary>' +
                '</entry>' +
            '</feed>');

        // Verify there's no outstanding request
        httpTestingController.verify();
    });
});
