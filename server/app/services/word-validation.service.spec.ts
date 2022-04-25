import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';

describe('word-validation service', () => {
    let wordValidationService: WordValidationService;

    beforeEach(async () => {
        wordValidationService = new WordValidationService();
    });

    it('should return 1', (done: Mocha.Done) => {
        const expectedResult = '1';
        const wordTest = 'oui';
        const dict = '';
        expect(wordValidationService.checkWordExistence(wordTest, dict)).to.equals(expectedResult);
        done();
    });
    it('should return 0', (done: Mocha.Done) => {
        const expectedResult = '0';
        const wordTest = 'atbr';
        const dict = '';

        expect(wordValidationService.checkWordExistence(wordTest, dict)).to.equals(expectedResult);
        done();
    });
});
