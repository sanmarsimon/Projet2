/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-magic-numbers */

import { Dict } from './dict';


describe('Dict', () => {
    it('should create an instance', () => {
        expect(new Dict('dict1', 'dict des romans', ['victoire', 'hugo'])).toBeTruthy();
    });
});
