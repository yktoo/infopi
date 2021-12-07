import { NewsItem } from './news-item';

describe('NewsItem', () => {

    it('creates an instance', () => {
        expect(new NewsItem('', '', new Date())).toBeTruthy();
    });

    describe('lastUpdateText', () => {

        beforeEach(() => {
            // Fix the clock at 31-12-2010, 14:15:16
            jasmine.clock().install();
            jasmine.clock().mockDate(new Date(2010, 11, 31, 14, 15, 16));
        });

        afterEach(() => jasmine.clock().uninstall());

        it('returns empty text when no date', () => {
            const item = new NewsItem('', '');
            expect(item.lastUpdateText).toBe('');
        });

        it('returns Just now for same instant', () => {
            const item = new NewsItem('', '', new Date());
            expect(item.lastUpdateText).toBe('Just now');
        });

        it('returns Just now for interval less than a minute', () => {
            const item = new NewsItem('', '', new Date(2010, 11, 31, 14, 14, 17));
            expect(item.lastUpdateText).toBe('Just now');
        });

        it('returns A minute ago for 1 minute', () => {
            const item = new NewsItem('', '', new Date(2010, 11, 31, 14, 14, 16));
            expect(item.lastUpdateText).toBe('A minute ago');
        });

        it('returns number of minutes', () => {
            const item = new NewsItem('', '', new Date(2010, 11, 31, 14, 0, 0));
            expect(item.lastUpdateText).toBe('15 minutes ago');
        });

        it('returns An hour ago for 1 hour', () => {
            const item = new NewsItem('', '', new Date(2010, 11, 31, 13, 15, 16));
            expect(item.lastUpdateText).toBe('An hour ago');
        });

        it('returns number of hours', () => {
            const item = new NewsItem('', '', new Date(2010, 11, 31, 4, 0, 0));
            expect(item.lastUpdateText).toBe('10 hours ago');
        });

        it('returns Yesterday for yesterday', () => {
            const item = new NewsItem('', '', new Date(2010, 11, 30, 14, 15, 16));
            expect(item.lastUpdateText).toBe('Yesterday');
        });

        it('returns A month ago for 1 month', () => {
            const item = new NewsItem('', '', new Date(2010, 11, 1, 14, 15, 16));
            expect(item.lastUpdateText).toBe('A month ago');
        });

        it('returns number of months', () => {
            const item = new NewsItem('', '', new Date(2010, 1, 2, 4, 0, 0));
            expect(item.lastUpdateText).toBe('11 months ago');
        });

        it('returns A year ago for 1 year', () => {
            const item = new NewsItem('', '', new Date(2009, 11, 31, 14, 15, 16));
            expect(item.lastUpdateText).toBe('A year ago');
        });

        it('returns number of years', () => {
            const item = new NewsItem('', '', new Date(2001, 1, 2, 4, 0, 0));
            expect(item.lastUpdateText).toBe('9 years ago');
        });

    });
});
