import { ASCI_A } from '@app/constant';
import { Position } from '@app/interfaces/position';
import letter_bank from '@assets/letter-bank';
import { Letter } from './letter';

export class Utils {
    virtualPlayerBoard = '';
    playerName: string;
    stringToLetterArray(word: string): Letter[] {
        const result: Letter[] = [];
        for (const x of word) {
            for (const letter of letter_bank.bank) {
                if (letter.letter.toLowerCase() === x) {
                    result.push(new Letter(x.toUpperCase(), letter.value));
                }
            }
        }
        return result;
    }
    letterArrayToString(letterArray: Letter[] | null) {
        let result = '';
        if (letterArray == null) return '';
        for (const letter of letterArray) {
            result += letter.letter.toLowerCase();
        }
        return result;
    }
    convertPositionToString(position: Position) {
        return `${String.fromCharCode(position.coords[0] + ASCI_A)}${position.coords[1] + 1}${position.orientation}`;
    }
    nextPermutation(array: string[]) {
        let i = array.length - 1;
        while (i > 0 && array[i - 1] >= array[i]) i--;
        if (i <= 0) return false;
        let j = array.length - 1;
        while (array[j] <= array[i - 1]) j--;
        let temp = array[i - 1];
        array[i - 1] = array[j];
        array[j] = temp;
        j = array.length - 1;
        while (i < j) {
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            i++;
            j--;
        }
        return true;
    }
}
