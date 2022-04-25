import { Inject, Injectable } from '@angular/core';
import { WordDictionnary } from '@app/classes/word-dictionnary';
import {
    BONUS_7_LETTERS,
    matrixOfBonusPoints,
    matrixOfLetter,
    MAX_LETTERS,
    SIZE_FOR_BONUS_POINTS,
    SIZE_X_MATRIX,
    SIZE_Y_MATRIX,
    VALEURDOUBLEMOT,
    VALEURTRIPLEMOT,
    VERIFWORD,
} from '@app/constant';
import { PlayerService } from '@app/services/player.service';
import dictionnary from '@assets/dictionnary.json';
import { LettersStockService } from './letters-stock.service';
@Injectable({
    providedIn: 'root',
})
export class WordAction {
    listBonusWords: number[] = [];
    listOfIndex: number[][] = [];
    listOfWordsToVerify: string[] = [];
    verifNearLetter: number = 0;
    constructor(@Inject(LettersStockService) private letterStockService: LettersStockService, private playerService: PlayerService) {}
    checkWordExistence(word: string): boolean {
        const dictword = dictionnary as WordDictionnary;
        return VERIFWORD !== dictword.words.findIndex((element) => word === element);
    }
    // eslint-disable-next-line complexity
    verifyPlaceForLetters(word: string, row: number, col: number, direction: string): { value: boolean; message: string } {
        if (direction === 'h') {
            if (col !== 0 && col !== SIZE_Y_MATRIX) {
                if (matrixOfLetter[row][col - 1] !== '') {
                    this.verifNearLetter++;
                }
            }
            if (row === 0 || row === SIZE_Y_MATRIX - 1) {
                for (let i = 0; i < word.length; i++) {
                    const cursor = row === 0 ? 1 : SIZE_X_MATRIX - 2;
                    if (matrixOfLetter[cursor][col + i] !== '') {
                        this.verifNearLetter++;
                    }
                }
            }
            for (let k = 0; k < word.length; k++) {
                for (let j = col; j < SIZE_X_MATRIX; j++) {
                    if (matrixOfLetter[row][j] !== '') {
                        if (matrixOfLetter[row][j] !== word.charAt(k)) {
                            return {
                                value: false,
                                message: 'Il y a déjà une lettre a l endroit ou vous désirez placer vos lettre',
                            };
                        }
                    }
                    if (row !== 0 && row !== SIZE_X_MATRIX) {
                        if (matrixOfLetter[row - 1][j] !== '' || matrixOfLetter[row + 1][j] !== '' || (row === MAX_LETTERS && j === MAX_LETTERS)) {
                            this.verifNearLetter++;
                        }
                    }
                    k++;
                    if (k === word.length) {
                        j = SIZE_X_MATRIX;
                    }
                }
            }
        } else if (direction === 'v') {
            if (row !== 0 && row !== SIZE_X_MATRIX) {
                if (matrixOfLetter[row - 1][col] !== '') {
                    this.verifNearLetter++;
                }
            }
            if (col === 0 || col === SIZE_Y_MATRIX - 1) {
                for (let i = 0; i < word.length; i++) {
                    const cursor = col === 0 ? 1 : SIZE_X_MATRIX - 2;
                    if (matrixOfLetter[row + i][cursor] !== '') {
                        this.verifNearLetter++;
                    }
                }
            }
            for (let k = 0; k < word.length; k++) {
                for (let i = row; i < SIZE_Y_MATRIX; i++) {
                    if (matrixOfLetter[i][col] !== '') {
                        if (matrixOfLetter[i][col] !== word.charAt(k)) {
                            return {
                                value: false,
                                message: 'Il y a déjà une lettre a l endroit ou vous désirez placer vos lettre',
                            };
                        }
                    }
                    if (col !== 0 && col !== SIZE_Y_MATRIX) {
                        if (matrixOfLetter[i][col - 1] !== '' || matrixOfLetter[i][col + 1] !== '' || (i === MAX_LETTERS && col === MAX_LETTERS)) {
                            this.verifNearLetter++;
                        }
                    }
                    k++;
                    if (k === word.length) {
                        i = SIZE_Y_MATRIX;
                    }
                }
            }
        }
        if (this.verifNearLetter === 0) {
            return {
                value: false,
                message: "L'emplacement du mot n'est pas valide",
            };
        }
        this.verifNearLetter = 0;
        return {
            value: true,
            message: 'placement valide',
        };
    }
    placeWordMatrix(word: string, row: number, col: number, direction: string) {
        if (direction === 'v') {
            for (let k = 0; k < word.length; k++) {
                for (let i = row; i < SIZE_X_MATRIX; i++) {
                    if (matrixOfLetter[i][col] === '') {
                        matrixOfLetter[i][col] = word.charAt(k);
                        k++;
                    } else if (matrixOfLetter[i][col] === word.charAt(k)) {
                        this.listOfIndex.push([i, col]);
                        k++;
                    }
                    if (k === word.length) {
                        i = SIZE_X_MATRIX;
                    }
                }
            }
        } else {
            for (let k = 0; k < word.length; k++) {
                for (let j = col; j < SIZE_Y_MATRIX; j++) {
                    if (matrixOfLetter[row][j] === '') {
                        matrixOfLetter[row][j] = word.charAt(k);
                        k++;
                    } else if (matrixOfLetter[row][j] === word.charAt(k)) {
                        this.listOfIndex.push([row, j]);
                        k++;
                    }
                    if (k === word.length) {
                        j = SIZE_Y_MATRIX;
                    }
                }
            }
        }
        this.calculateScore(word, row, col, direction);
    }
    deleteListBonus() {
        this.listBonusWords = [];
    }
    calculateScoreVertically(word: string, row: number, col: number, score: number): number {
        score = 0;
        for (let k = 0; k < word.length; k++) {
            for (let i = row; i < SIZE_Y_MATRIX; i++) {
                if (matrixOfBonusPoints[i][col] !== VALEURTRIPLEMOT && matrixOfBonusPoints[i][col] !== VALEURDOUBLEMOT) {
                    score += this.letterStockService.getLetterScore(word.charAt(k)) * matrixOfBonusPoints[i][col];
                    matrixOfBonusPoints[i][col] = 1;
                    k++;
                } else if (matrixOfBonusPoints[i][col] === VALEURTRIPLEMOT || matrixOfBonusPoints[i][col] === VALEURDOUBLEMOT) {
                    this.listBonusWords.push(matrixOfBonusPoints[i][col] / 2);
                    score += this.letterStockService.getLetterScore(word.charAt(k));
                    matrixOfBonusPoints[i][col] = 1;
                    k++;
                }
                if (k === word.length) {
                    i = SIZE_Y_MATRIX;
                }
            }
        }
        for (const bonus of this.listBonusWords) {
            score *= bonus;
        }
        return score;
    }
    calculateScore(word: string, row: number, col: number, direction: string, addScore: boolean = true): number {
        let score: number;
        score = 0;
        if (direction === 'h') {
            for (let k = 0; k < word.length; k++) {
                for (let j = col; j < SIZE_X_MATRIX; j++) {
                    if (matrixOfBonusPoints[row][j] !== VALEURDOUBLEMOT && matrixOfBonusPoints[row][j] !== VALEURTRIPLEMOT) {
                        score += this.letterStockService.getLetterScore(word.charAt(k)) * matrixOfBonusPoints[row][j];
                        matrixOfBonusPoints[row][j] = 1;
                        k++;
                    } else if (matrixOfBonusPoints[row][j] === VALEURDOUBLEMOT || matrixOfBonusPoints[row][j] === VALEURTRIPLEMOT) {
                        this.listBonusWords.push(matrixOfBonusPoints[row][j] / 2);
                        score += this.letterStockService.getLetterScore(word.charAt(k));
                        matrixOfBonusPoints[row][j] = 1;
                        k++;
                    }
                    if (k === word.length) {
                        j = SIZE_X_MATRIX;
                    }
                }
            }
            for (const bonus of this.listBonusWords) {
                score *= bonus;
            }
            this.deleteListBonus();
            if (word.length === SIZE_FOR_BONUS_POINTS) {
                score += BONUS_7_LETTERS;
            }
        } else if (direction === 'v') {
            score = this.calculateScoreVertically(word, row, col, score);
            this.deleteListBonus();
            if (word.length === SIZE_FOR_BONUS_POINTS) {
                score += BONUS_7_LETTERS;
            }
        }
        if (this.playerService.isTurn && addScore) {
            this.playerService.gainedPoints(score);
        } else {
            this.addOpponentScore(score, addScore);
        }
        return score;
    }
    addOpponentScore(score: number, addScore: boolean): void {
        if (addScore) this.playerService.gainedPointsOpponent(score);
    }
    verifyOtherWordsCombination(word: string, row: number, col: number, direction: string) {
        let tempWord = '';
        let posCol = 0;
        const posRow = 0;
        if (direction === 'v') {
            for (let k = 0; k < word.length; k++) {
                for (let i = row; i < SIZE_X_MATRIX; i++) {
                    for (const index of this.listOfIndex) {
                        if (index !== [i, col]) {
                            tempWord.concat(matrixOfLetter[i][col]);
                            posCol = col;
                            for (let m = col; m > 0; m--) {
                                if (matrixOfLetter[i][m] !== '') {
                                    tempWord += matrixOfLetter[i][m];
                                    posCol = m;
                                } else {
                                    m = 0;
                                }
                            }
                            for (let m = col; m < SIZE_X_MATRIX; m++) {
                                if (matrixOfLetter[i][m] !== '') {
                                    tempWord += matrixOfLetter[i][m];
                                } else {
                                    m = SIZE_X_MATRIX;
                                }
                            }
                            if (this.checkWordExistence(tempWord)) {
                                this.calculateScore(tempWord, i, posCol, 'h');
                            }
                        }
                    }
                    k++;
                    if (k === word.length) {
                        i = SIZE_X_MATRIX;
                    }
                }
            }
        } else {
            this.verifyOtherWordsCombinationHorizontally(word, row, col, tempWord, posRow);
        }
    }
    verifyOtherWordsCombinationHorizontally(word: string, row: number, col: number, tempWord: string, posRow: number) {
        for (let k = 0; k < word.length; k++) {
            for (let j = col; j < SIZE_Y_MATRIX; j++) {
                for (const index of this.listOfIndex) {
                    if (index !== [row, j]) {
                        tempWord.concat(matrixOfLetter[row][j]);
                        posRow = row;
                        for (let n = row; n > 0; n--) {
                            if (matrixOfLetter[n][j] !== '') {
                                tempWord += matrixOfLetter[n][j];
                                posRow = n;
                            } else {
                                n = 0;
                            }
                        }
                        for (let n = row; n < SIZE_Y_MATRIX; n++) {
                            if (matrixOfLetter[n][j] !== '') {
                                tempWord += matrixOfLetter[n][j];
                            } else {
                                n = SIZE_Y_MATRIX;
                            }
                        }
                        if (this.checkWordExistence(tempWord)) {
                            this.calculateScore(tempWord, posRow, j, 'v');
                        }
                    }
                }
                k++;
                if (k === word.length) {
                    j = SIZE_X_MATRIX;
                }
            }
        }
    }
}
