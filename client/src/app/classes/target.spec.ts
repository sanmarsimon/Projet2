/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Target } from './target';

describe('Target', () => {
    it('should create an instance', () => {
        expect(new Target(2, 'hola', 10, 5)).toBeTruthy();
    });
});
