/* eslint-disable complexity */
/* eslint-disable max-lines */
import { Inject, Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
    BONUS_7_LETTERS,
    matrixOfBonusPoints,
    matrixOfLetter,
    MAX_LETTERS,
    SINGLE_PLAYER_MODE,
    SIZE_FOR_BONUS_POINTS,
    SIZE_X_MATRIX,
    SIZE_Y_MATRIX,
    VALEURDOUBLEMOT,
    VALEURTRIPLEMOT,
} from '@app/constant';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from './multiplayer.service';
import { PlayerService } from './player.service';
@Injectable({
    providedIn: 'root',
})
export class WordActionMj {
    listBonusWords: number[] = [];
    listOfIndex: Vec2[] = [];
    listOfWordsToVerify: string[] = [];
    verifNearLetter: number = 0;
    constructor(
        private playerService: PlayerService,
        @Inject(MultiplayerService) private multiplayerService: MultiplayerService,
        private gameMasterService: GameMasterService,
    ) {}

    async checkWordExistence(word: string): Promise<boolean> {
        const valObs = this.multiplayerService.listen('validationWord').toPromise();
        this.multiplayerService.validateWord(word, this.gameMasterService.room);
        const val = await valObs;
        return val === '1';
    }

    // eslint-disable-next-line complexity
    async verifyPlaceForLetters(word: string, row: number, col: number, direction: string): Promise<boolean> {
        if (direction === 'h') {
            if (col !== 0 && col !== SIZE_Y_MATRIX) {
                if (matrixOfLetter[row][col - 1] !== '') {
                    this.verifNearLetter++;
                    this.listOfIndex.push({ x: row, y: col - 1 });
                }
                if (matrixOfLetter[row][col + word.length] !== '') {
                    this.verifNearLetter++;
                    this.listOfIndex.push({ x: row, y: col + word.length });
                }
            }
            for (let k = 0; k < word.length; k++) {
                for (let j = col; j < SIZE_X_MATRIX; j++) {
                    if (matrixOfLetter[row][j] !== '') {
                        if (matrixOfLetter[row][j] !== word.charAt(k)) {
                            return false;
                        }
                        if (matrixOfLetter[row][j] === word.charAt(k)) {
                            this.verifNearLetter++;
                        }
                    }
                    if (row !== 0 && row !== SIZE_X_MATRIX) {
                        if (matrixOfLetter[row - 1][j] !== '' || matrixOfLetter[row + 1][j] !== '' || (row === MAX_LETTERS && j === MAX_LETTERS)) {
                            this.verifNearLetter++;
                            if (matrixOfLetter[row - 1][j] !== '') {
                                this.listOfIndex.push({ x: row - 1, y: j });
                            }
                            if (matrixOfLetter[row + 1][j] !== '') {
                                this.listOfIndex.push({ x: row + 1, y: j });
                            }
                        }
                    } else if (row === 0) {
                        if (matrixOfLetter[row + 1][j] !== '') {
                            this.verifNearLetter++;
                            this.listOfIndex.push({ x: row + 1, y: j });
                        }
                    } else if (row === SIZE_X_MATRIX) {
                        if (matrixOfLetter[row - 1][j] !== '') {
                            this.verifNearLetter++;
                            this.listOfIndex.push({ x: row - 1, y: j });
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
                    this.listOfIndex.push({ x: row - 1, y: col });
                }
                if (matrixOfLetter[row + word.length][col] !== '') {
                    this.verifNearLetter++;
                    this.listOfIndex.push({ x: row + word.length, y: col });
                }
            }
            for (let k = 0; k < word.length; k++) {
                for (let i = row; i < SIZE_Y_MATRIX; i++) {
                    if (matrixOfLetter[i][col] !== '') {
                        if (matrixOfLetter[i][col] !== word.charAt(k)) {
                            return false;
                        }
                        if (matrixOfLetter[i][col] !== word.charAt(k)) {
                            this.verifNearLetter++;
                        }
                    }
                    if (col !== 0 && col !== SIZE_Y_MATRIX) {
                        if (matrixOfLetter[i][col - 1] !== '' || matrixOfLetter[i][col + 1] !== '' || (i === MAX_LETTERS && col === MAX_LETTERS)) {
                            this.verifNearLetter++;
                            if (matrixOfLetter[i][col - 1] !== '') {
                                this.listOfIndex.push({ x: i, y: col - 1 });
                            }
                            if (matrixOfLetter[i][col + 1] !== '') {
                                this.listOfIndex.push({ x: i, y: col + 1 });
                            }
                        }
                    } else if (col === 0) {
                        if (matrixOfLetter[i][col + 1] !== '') {
                            this.listOfIndex.push({ x: i, y: col + 1 });
                            this.verifNearLetter++;
                        }
                    } else if (col === SIZE_Y_MATRIX) {
                        if (matrixOfLetter[i][col - 1] !== '') {
                            this.listOfIndex.push({ x: i, y: col - 1 });
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
            return false;
        }
        if (!(this.gameMasterService.gameMode === SINGLE_PLAYER_MODE)) {
            if (!(await this.verifyOtherWordsCombination(word, row, col, direction))) {
                return false;
            }
        }
        this.verifNearLetter = 0;
        this.calculateScore(word, row, col, direction);
        return true;
    }
    placeWordMatrix(word: string, row: number, col: number, direction: string) {
        if (direction === 'v') {
            for (let k = 0; k < word.length; k++) {
                for (let i = row; i < SIZE_X_MATRIX; i++) {
                    if (matrixOfLetter[i][col] === '') {
                        matrixOfLetter[i][col] = word.charAt(k);
                        k++;
                    } else if (matrixOfLetter[i][col] === word.charAt(k)) {
                        this.listOfIndex.push({ x: i, y: col });
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
                        this.listOfIndex.push({ x: row, y: j });
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
                    score += this.playerService.findValueToLetter(word.charAt(k)) * matrixOfBonusPoints[i][col];
                    matrixOfBonusPoints[i][col] = 1;
                    k++;
                } else if (matrixOfBonusPoints[i][col] === VALEURTRIPLEMOT || matrixOfBonusPoints[i][col] === VALEURDOUBLEMOT) {
                    this.listBonusWords.push(matrixOfBonusPoints[i][col] / 2);
                    score += this.playerService.findValueToLetter(word.charAt(k));
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
    calculateScore(word: string, row: number, col: number, direction: string): number {
        let score: number;
        score = 0;
        if (direction === 'h') {
            for (let k = 0; k < word.length; k++) {
                for (let j = col; j < SIZE_X_MATRIX; j++) {
                    if (matrixOfBonusPoints[row][j] !== VALEURDOUBLEMOT && matrixOfBonusPoints[row][j] !== VALEURTRIPLEMOT) {
                        score += this.playerService.findValueToLetter(word.charAt(k)) * matrixOfBonusPoints[row][j];
                        matrixOfBonusPoints[row][j] = 1;
                        k++;
                    } else if (matrixOfBonusPoints[row][j] === VALEURDOUBLEMOT || matrixOfBonusPoints[row][j] === VALEURTRIPLEMOT) {
                        this.listBonusWords.push(matrixOfBonusPoints[row][j] / 2);
                        score += this.playerService.findValueToLetter(word.charAt(k));
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
        if (this.playerService.isTurn) {
            this.playerService.gainedPoints(score);
        } else {
            this.playerService.gainedPointsOpponent(score);
        }
        return score;
    }
    // eslint-disable-next-line complexity
    async verifyOtherWordsCombination(word: string, row: number, col: number, direction: string): Promise<boolean> {
        let tempWord = '';
        let tempRow = 0;
        let tempCol = 0;
        if (direction === 'v') {
            for (let i = 0; i < word.length; i++) {
                for (const index of this.listOfIndex) {
                    if (index.x === row - 1 && index.y === col && i === 0) {
                        tempWord = word;
                        for (let k = 1; k <= MAX_LETTERS; k++) {
                            if (matrixOfLetter[row + k + word.length][col] !== '') {
                                tempWord += matrixOfLetter[row + k + word.length][col];
                            } else {
                                k = MAX_LETTERS + 1;
                            }
                        }
                        for (let j = 1; j <= MAX_LETTERS; j++) {
                            if (matrixOfLetter[row - j][col] !== '') {
                                tempWord = matrixOfLetter[row - j][col] + tempWord;
                                tempRow = row - j;
                                tempCol = col;
                            } else {
                                if (!(await this.checkWordExistence(tempWord))) {
                                    return false;
                                }
                                for (const verif of this.listOfWordsToVerify) {
                                    if (verif === tempWord) {
                                        tempWord = '';
                                    }
                                }
                                this.listOfWordsToVerify.push(tempWord);
                                this.calculateScore(tempWord, tempRow, tempCol, direction);
                                tempRow = 0;
                                tempCol = 0;
                                tempWord = '';
                                j = MAX_LETTERS + 1;
                                tempWord = '';
                            }
                        }
                    }
                    if (index.x === i + row && index.y === col && i === word.length) {
                        tempWord = word;
                        for (let k = 1; k <= MAX_LETTERS; k++) {
                            if (matrixOfLetter[row - k][col] !== '') {
                                tempWord = matrixOfLetter[row - k][col] + tempWord;
                                tempRow = row - k;
                                tempCol = col;
                            } else {
                                k = MAX_LETTERS + 1;
                            }
                        }
                        for (let j = 1; j <= MAX_LETTERS; j++) {
                            if (matrixOfLetter[row + i + j][col] !== '') {
                                tempWord += matrixOfLetter[row + i + j][col];
                            } else {
                                if (!(await this.checkWordExistence(tempWord))) {
                                    return false;
                                }
                                for (const verif of this.listOfWordsToVerify) {
                                    if (verif === tempWord) {
                                        tempWord = '';
                                    }
                                }
                                this.listOfWordsToVerify.push(tempWord);
                                this.calculateScore(tempWord, tempRow, tempCol, direction);
                                tempRow = 0;
                                tempCol = 0;
                                tempWord = '';
                                j = MAX_LETTERS + 1;
                                tempWord = '';
                            }
                        }
                    }
                    if (index.x === row + i && index.y === col - 1) {
                        tempWord += word.charAt(i);
                        if (matrixOfLetter[row + i][col] !== '') {
                            for (let k = 1; k <= MAX_LETTERS; k++) {
                                if (matrixOfLetter[row + i][col + k] !== '') {
                                    tempWord += matrixOfLetter[row + i][col + k];
                                } else {
                                    k = MAX_LETTERS + 1;
                                }
                            }
                        }
                        for (let j = 1; j <= MAX_LETTERS; j++) {
                            if (matrixOfLetter[row + i][col - j] !== '') {
                                tempWord = matrixOfLetter[row + i][col - j] + tempWord;
                                tempRow = row + i;
                                tempCol = col - j;
                            } else {
                                if (!(await this.checkWordExistence(tempWord))) {
                                    return false;
                                }
                                for (const verif of this.listOfWordsToVerify) {
                                    if (verif === tempWord) {
                                        tempWord = '';
                                    }
                                }
                                this.listOfWordsToVerify.push(tempWord);
                                this.calculateScore(tempWord, tempRow, tempCol, direction);
                                tempRow = 0;
                                tempCol = 0;
                                j = MAX_LETTERS + 1;
                                tempWord = '';
                            }
                        }
                    }
                    if (index.x === row + i && index.y === col + 1) {
                        tempRow = row + i;
                        tempCol = col + 1;
                        tempWord += word.charAt(i);
                        if (matrixOfLetter[row + i][col - 1] !== '') {
                            for (let k = 1; k <= MAX_LETTERS; k++) {
                                if (matrixOfLetter[row + i][col - k] !== '') {
                                    tempWord = matrixOfLetter[row + i][col - k] + tempWord;
                                    tempRow = row + i;
                                    tempCol = col - k;
                                } else {
                                    k = MAX_LETTERS + 1;
                                }
                            }
                        }
                        for (let j = 1; j <= MAX_LETTERS; j++) {
                            if (matrixOfLetter[row + i][col + j] !== '') {
                                tempWord += matrixOfLetter[row + i][col + j];
                            } else {
                                if (!(await this.checkWordExistence(tempWord))) {
                                    return false;
                                }
                                j = MAX_LETTERS + 1;
                                for (const verif of this.listOfWordsToVerify) {
                                    if (verif === tempWord) {
                                        tempWord = '';
                                    }
                                }
                                this.listOfWordsToVerify.push(tempWord);
                                this.calculateScore(tempWord, tempRow, tempCol, direction);
                                tempRow = 0;
                                tempCol = 0;
                                tempWord = '';
                            }
                        }
                    }
                }
            }
            return true;
        } else {
            if (!(await this.verifyOtherWordsCombinationHorizontally(word, row, col))) {
                return false;
            }
            return true;
        }
    }
    async verifyOtherWordsCombinationHorizontally(word: string, row: number, col: number): Promise<boolean> {
        let tempWord = '';
        let tempRow = 0;
        let tempCol = 0;
        for (let i = 1; i <= word.length; i++) {
            for (const index of this.listOfIndex) {
                if (index.x === row && index.y === col - i && i === 1) {
                    tempWord = word;
                    for (let k = 1; k <= MAX_LETTERS; k++) {
                        if (matrixOfLetter[row][col + word.length + k] !== '') {
                            tempWord += matrixOfLetter[row][col + word.length + k];
                        } else {
                            k = MAX_LETTERS + 1;
                        }
                    }
                    for (let j = 1; j <= MAX_LETTERS; j++) {
                        if (matrixOfLetter[row][col - j] !== '') {
                            tempWord = matrixOfLetter[row][col - j] + tempWord;
                            tempRow = row;
                            tempCol = col - j;
                        } else {
                            if (!(await this.checkWordExistence(tempWord))) {
                                return false;
                            }
                            for (const verif of this.listOfWordsToVerify) {
                                if (verif === tempWord) {
                                    tempWord = '';
                                }
                            }
                            this.listOfWordsToVerify.push(tempWord);
                            this.calculateScore(tempWord, tempRow, tempCol, 'h');
                            tempRow = 0;
                            tempCol = 0;
                            j = MAX_LETTERS + 1;
                            tempWord = '';
                        }
                    }
                }
                if (index.x === row && index.y === col + i && col === word.length) {
                    tempWord = word;
                    for (let k = 1; k <= MAX_LETTERS; k++) {
                        if (matrixOfLetter[row][col - word.length - k] !== '') {
                            tempCol = col - word.length - k;
                            tempRow = row;
                            tempWord = matrixOfLetter[row][col - word.length - k] + tempWord;
                        } else {
                            k = MAX_LETTERS + 1;
                        }
                    }
                    for (let j = 1; j <= MAX_LETTERS; j++) {
                        if (matrixOfLetter[row][col + j] !== '') {
                            tempWord += matrixOfLetter[row][col + j];
                        } else {
                            if (!(await this.checkWordExistence(tempWord))) {
                                return false;
                            }
                            for (const verif of this.listOfWordsToVerify) {
                                if (verif === tempWord) {
                                    tempWord = '';
                                }
                            }
                            this.listOfWordsToVerify.push(tempWord);
                            this.calculateScore(tempWord, tempRow, tempCol, 'h');
                            tempRow = 0;
                            tempCol = 0;
                            j = MAX_LETTERS + 1;
                            tempWord = '';
                        }
                    }
                }
                if (index.x === row - 1 && index.y === col + i) {
                    tempWord += word.charAt(i);
                    if (matrixOfLetter[row + 1][col + i] !== '') {
                        for (let k = 1; k <= SIZE_FOR_BONUS_POINTS; k++) {
                            if (matrixOfLetter[row + k][col + i] !== '') {
                                tempWord += matrixOfLetter[row + k][col + i];
                            } else {
                                k = MAX_LETTERS + 1;
                            }
                        }
                    }
                    for (let j = 1; j <= MAX_LETTERS; j++) {
                        if (matrixOfLetter[row - j][col + j] !== '') {
                            tempWord += matrixOfLetter[row - j][col + i] + tempWord;
                            tempRow = row - j;
                            tempCol = col + i;
                        } else {
                            if (!(await this.checkWordExistence(tempWord))) {
                                return false;
                            }
                            for (const verif of this.listOfWordsToVerify) {
                                if (verif === tempWord) {
                                    tempWord = '';
                                }
                            }
                            this.listOfWordsToVerify.push(tempWord);
                            this.calculateScore(tempWord, tempRow, tempCol, 'h');
                            tempRow = 0;
                            tempCol = 0;
                            j = MAX_LETTERS + 1;
                            tempWord = '';
                        }
                    }
                }
                if (index.x === row + 1 && index.y === col + i) {
                    tempWord += word.charAt(i);
                    if (matrixOfLetter[row - 1][col + i] !== '') {
                        for (let k = 1; k <= MAX_LETTERS; k++) {
                            if (matrixOfLetter[row - k][col + i] !== '') {
                                tempWord += matrixOfLetter[row - k][col + i] + tempWord;
                                tempRow = row - k;
                                tempCol = col + i;
                            } else {
                                k = MAX_LETTERS + 1;
                            }
                        }
                    }
                    for (let j = 1; j <= MAX_LETTERS; j++) {
                        if (matrixOfLetter[row + j][col + i] !== '') {
                            tempWord += matrixOfLetter[row][col + j];
                        } else {
                            if (!(await this.checkWordExistence(tempWord))) {
                                return false;
                            }
                            for (const verif of this.listOfWordsToVerify) {
                                if (verif === tempWord) {
                                    tempWord = '';
                                }
                            }
                            this.listOfWordsToVerify.push(tempWord);
                            this.calculateScore(tempWord, tempRow, tempCol, 'h');
                            tempRow = 0;
                            tempCol = 0;
                            j = MAX_LETTERS + 1;
                            tempWord = '';
                        }
                    }
                }
            }
        }
        return true;
    }
}
