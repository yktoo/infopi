import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {

    let pipe: TruncatePipe;

    beforeEach(() => pipe = new TruncatePipe());

    [
        {in: undefined, len: 80, want: 'undefined'},
        {in: null,      len: 80, want: 'null'},
        {in: '',        len: 80, want: ''},
        {in: 'abc',     len: 80, want: 'abc'},
        {in: 'abc',     len:  3, want: 'abc'},
        {in: 'abc',     len:  2, want: 'a…'},
    ].forEach(test =>
        it(`given "${test.in}" and maxLength=${test.len} returns "${test.want}"`, () =>
            expect(pipe.transform(test.in, test.len)).toBe(test.want)));
});
