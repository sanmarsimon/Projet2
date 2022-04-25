import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { LETTERS_STOCK_MAX_LENGTH, MAX_LETTERS } from '@app/constant';
import letterBank from '@assets/letter-bank';

@Injectable({
    providedIn: 'root',
})
export class LettersStockService {
    letterStock: Letter[] = [];
    constructor() {
        // On itere sur les objets du fichier letterBank.json
        for (const i of letterBank.bank) {
            this.addToStock(i.letter, i.value, i.quantity);
        }
    }
    addToStock(letter: string, valueOfLetter: number, quantity: number) {
        let arrayIndex = 0;
        while (arrayIndex < quantity && this.letterStock.length < LETTERS_STOCK_MAX_LENGTH) {
            this.letterStock.push(new Letter(letter, valueOfLetter));
            arrayIndex++;
        }
    }
    getFromStock(quantity: number): Letter[] {
        if (quantity <= 0 || quantity > this.letterStock.length || quantity > MAX_LETTERS) {
            return [];
        } else if (quantity === 1) {
            const index = Math.floor(Math.random() * this.letterStock.length);
            return this.letterStock.splice(index, 1);
        } else {
            const lettersToReturn: Letter[] = [];
            for (let i = 0; i < quantity; i++) {
                const index = Math.floor(Math.random() * this.letterStock.length);
                lettersToReturn.push(new Letter(this.letterStock[index].letter, this.letterStock[index].value));
                this.letterStock.splice(index, 1);
            }
            return lettersToReturn;
        }
    }
    swapLetters(letters: Letter[]): Letter[] {
        const lettersToReturn: Letter[] = this.getFromStock(letters.length);
        if (lettersToReturn.length === letters.length) {
            for (const x of letters) {
                this.addToStock(x.letter, x.value, 1);
            }
        }
        return lettersToReturn;
    }
    getLetterScore(letter: string): number {
        for (const element of letterBank.bank) {
            if (element.letter === letter.toUpperCase()) {
                return element.value;
            }
        }
        return 0;
    }
    removeFromStock(quantity: number) {
        if (quantity > MAX_LETTERS || quantity <= 0) {
            return;
        } else {
            while (quantity > 0) {
                const index = Math.floor(Math.random() * this.letterStock.length);
                this.letterStock.splice(index, 1);
                quantity--;
            }
        }
    }
}
