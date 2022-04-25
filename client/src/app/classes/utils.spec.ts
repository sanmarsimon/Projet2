/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Letter } from './letter';
import { Utils } from './utils';

describe('Utils', () => {
    const utils = new Utils();
    it('should be created', () => {
        expect(utils).toBeTruthy();
    });

    it('should return nothing if tab is null ', () => {
        const expected: Letter[] = [];
        expected.push(new Letter('H', 4));
        expected.push(new Letter('E', 1));
        expected.push(new Letter('Y', 10));
        const result = utils.stringToLetterArray('hey');
        expect(result.length).toBe(3);
        expect(result).toEqual(expected);
    });

    it('should return nothing if tab is null ', () => {
        const result = '';
        const tab: Letter[] = [
            { letter: '', value: 0 },
            { letter: '', value: 0 },
        ];
        expect(utils.letterArrayToString(tab)).toEqual(result);
    });

    it('should return nothing if tab is null ', () => {
        const result = '';
        const tab: Letter[] = [];
        expect(utils.letterArrayToString(tab)).toEqual(result);
    });

    it('should return a string ', () => {
        const result = 'ab';
        const tab: Letter[] = [
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
        ];
        expect(utils.letterArrayToString(tab)).toEqual(result);
    });

    it('should convert Position To String   ', () => {
        const position = {
            coords: [1, 2],
            orientation: 'string',
        };
        utils.convertPositionToString(position);
    });

    it('should move to the nextPermutation if array.length-1<0  ', () => {
        expect(utils.nextPermutation(['x', 'a'])).toBeFalse();
    });

    it('should return true for nextPermutation  ', () => {
        const array: string[] = ['x', 'a', 'a', 'a', 'x', 'a', 'a', 'a'];
        expect(utils.nextPermutation(array)).toBeTrue();
    });
});
