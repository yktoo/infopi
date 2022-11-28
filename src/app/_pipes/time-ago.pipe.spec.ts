import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {

    let pipe: TimeAgoPipe;

    beforeEach(() => {
        pipe = new TimeAgoPipe();

        // Fix the clock at 31-12-2010, 14:15:16
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(2010, 11, 31, 14, 15, 16));
    });

    afterEach(() => jasmine.clock().uninstall());

    [
        {date: undefined,                          want: ''},
        {date: null,                               want: ''},
        {date: new Date(),                         want: 'Just now'},
        {date: new Date(2010, 11, 31, 14, 14, 17), want: 'Just now'},
        {date: new Date(2010, 11, 31, 14, 14, 16), want: 'A minute ago'},
        {date: new Date(2010, 11, 31, 14, 0, 0),   want: '15 minutes ago'},
        {date: new Date(2010, 11, 31, 13, 15, 16), want: 'An hour ago'},
        {date: new Date(2010, 11, 31, 4, 0, 0),    want: '10 hours ago'},
        {date: new Date(2010, 11, 30, 14, 15, 16), want: 'Yesterday'},
        {date: new Date(2010, 11, 1, 14, 15, 16),  want: 'A month ago'},
        {date: new Date(2010, 1, 2, 4, 0, 0),      want: '11 months ago'},
        {date: new Date(2009, 11, 31, 14, 15, 16), want: 'A year ago'},
        {date: new Date(2001, 1, 2, 4, 0, 0),      want: '9 years ago'},
    ].forEach(test =>
        it(`returns "${test.want}" when date is ${test.date}`, () => {
            expect(pipe.transform(test.date)).toBe(test.want);
        }));
});
