/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { LettersStockService } from './letters-stock.service';

describe('LettersStockService', () => {
    let service: LettersStockService = new LettersStockService();

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LettersStockService);
    });

    it('should be created', () => {
        expect(service.letterStock.length).toEqual(102);
    });

    it('first letter should be an A', () => {
        expect(service.letterStock[0].letter).toEqual('A');
    });

    it('should add a letter at the end of the array', () => {
        service.getFromStock(1);
        service.addToStock('A', 1, 1);
        expect(service.letterStock[service.letterStock.length - 1].letter).toEqual('A');
        expect(service.letterStock.length).toEqual(102);
    });

    it('should remove 5 random letters', () => {
        expect(service.getFromStock(5)?.length).toEqual(5);
        expect(service.letterStock.length).toEqual(97);
    });

    it('should return a empty Letter when quantity=0', () => {
        const tab: Letter[] = [];
        const res = service.getFromStock(0);
        expect(res).toEqual(tab);
    });

    it('should swap letters', () => {
        const tab: Letter[] = [
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
        ];
        const spy = spyOn(service, 'addToStock');
        service.swapLetters(tab);
        expect(spy).toHaveBeenCalled();
    });

    it('should get one letter from the stock', () => {
        expect(service.getFromStock(1).length).toEqual(1);
    });

    it('should never be more than 102 letters in stock', () => {
        service.addToStock('A', 1, 10);
        expect(service.letterStock.length).toEqual(102);
    });

    it('should return an empty array if more than 7 letters are asked', () => {
        expect(service.getFromStock(10).length).toEqual(0);
    });

    it('should return an empty array if more than 7 letteres are trying to be swapped and it should not add letters in the stock', () => {
        const lettersToSwap: Letter[] = [
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
        ];
        expect(service.swapLetters(lettersToSwap).length).toEqual(0);
        expect(service.letterStock.length).toEqual(102);
    });
    it('should return a the letter value from the letter bank', () => {
        const letter = 'l';
        const res = service.getLetterScore(letter);
        expect(res).toBe(1);
    });
    it('should return a the letter value from the letter bank', () => {
        const letter = '';
        const res = service.getLetterScore(letter);
        expect(res).toBe(0);
    });

    it('should return nothing if the quantity is more than 7', () => {
        const quantity = 8;
        service.letterStock = [
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
            { letter: 'a', value: 0 },
            { letter: 'b', value: 1 },
        ];
        expect(service.letterStock.length).toEqual(8);
        expect(service.removeFromStock(quantity));
    });

    it('should return an empty array if more than 7 letters are asked', () => {
        const quantity = 1;
        service.letterStock = [];
        expect(service.letterStock.length).toEqual(0);
        expect(service.removeFromStock(quantity));
    });

    it('should remove x letters from the stock', () => {
        const quantity = 5;
        expect(service.letterStock.length).toEqual(102);
        expect(service.removeFromStock(quantity));
        expect(service.letterStock.length).toEqual(97);
    });
});
