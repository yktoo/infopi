import { vi } from 'vitest';
import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {

    let pipe: TimeAgoPipe;

    beforeEach(() => {
        pipe = new TimeAgoPipe();

        // Fix the clock at 31-12-2010, 14:15:16
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2010, 11, 31, 14, 15, 16));
    });

    afterEach(() => vi.useRealTimers());

    [
        {date: undefined,                          want: ''},
        {date: null,                               want: ''},
        {date: new Date(2010, 11, 31, 14, 14, 17), want: 'just now'},
        {date: new Date(2010, 11, 31, 14, 14, 16), want: '1 minute ago'},
        {date: new Date(2010, 11, 31, 14, 0, 0),   want: '15 minutes ago'},
        {date: new Date(2010, 11, 31, 13, 15, 16), want: '1 hour ago'},
        {date: new Date(2010, 11, 31, 4, 0, 0),    want: '10 hours ago'},
        {date: new Date(2010, 11, 30, 14, 15, 16), want: 'yesterday'},
        {date: new Date(2010, 11, 1, 14, 15, 16),  want: 'last month'},
        {date: new Date(2010, 1, 2, 4, 0, 0),      want: '11 months ago'},
        {date: new Date(2009, 11, 31, 14, 15, 16), want: 'last year'},
        {date: new Date(2001, 1, 2, 4, 0, 0),      want: '9 years ago'},
    ]
        .forEach(test =>
            it(`returns "${test.want}" when date is ${test.date}`, () =>
                expect(pipe.transform(test.date)).toBe(test.want)));

});
