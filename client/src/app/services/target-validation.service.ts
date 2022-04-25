import { Injectable } from '@angular/core';
import { Target } from '@app/classes/target';
import {
    ASCI_A,
    DOUBLE_BONUS_OBJECTIVE,
    FIVE_LETTER_WORD,
    matrixOfBonusPoints,
    SCORE_THRESHOLD_OBJECTIVE,
    TARGET_ID0,
    TARGET_ID1,
    TARGET_ID2,
    TARGET_ID3,
    TARGET_ID4,
    TARGET_ID5,
    TARGET_ID6,
    TARGET_ID7,
    VALEURDOUBLEMOT,
    VOWELS_COUNT_OBJECTIVE,
    VOWES_STRING,
} from '@app/constant';
import targetsBank from '@assets/targets-bank';
import { WordAction } from './word-action-solo.service';

@Injectable({
    providedIn: 'root',
})
export class TargetValidationService {
    targetsStock: Target[] = [];
    positionQueue = {
        lastDirection: '',
        totalInRow: 0,
    };
    constructor(private wordAction: WordAction) {
        for (const i of targetsBank.targets) {
            this.targetsStock.push(new Target(i.id, i.description, i.points, i.totalOccurencesToComplete));
        }
    }
    checkIfSameLetterOccurTwice(word: string): boolean {
        const letters = word.split('');
        for (let i = 0; i < letters.length; i++) {
            for (let j = i + 1; j < letters.length; j++) {
                if (letters[i] === letters[j]) {
                    return true;
                }
            }
        }
        return false;
    }
    isPalindrome(word: string): boolean {
        const letters = word.split('');
        for (let i = 0; i < letters.length / 2; i++) {
            if (letters[i] !== letters[letters.length - 1 - i]) {
                return false;
            }
        }
        return true;
    }
    checkFourVowels(word: string): boolean {
        let vowelsCount = 0;
        for (const letter of word) {
            if (VOWES_STRING.indexOf(letter) >= 0) {
                vowelsCount++;
            }
        }
        return vowelsCount >= VOWELS_COUNT_OBJECTIVE;
    }
    checkConsecutiveDirection(command: string): boolean {
        const cmdElements = command.split(' ');
        if (cmdElements[0] === '!placer') {
            if (this.positionQueue.totalInRow === 0 || this.positionQueue.lastDirection !== cmdElements[1][2]) {
                this.positionQueue = {
                    totalInRow: 1,
                    lastDirection: cmdElements[1][2],
                };
            } else {
                this.positionQueue.totalInRow++;
            }
        }
        return this.positionQueue.totalInRow >= 3;
    }
    checkScoreThresholdObjective(word: string, command: string): boolean {
        const cmdElements = command.split(' ');
        const line = cmdElements[1][0].charCodeAt(0) - ASCI_A;
        const col = parseInt(cmdElements[1][1], 10);
        const dir = cmdElements[1][2];
        const wordScore = this.wordAction.calculateScore(word, line, col, dir, false);
        return wordScore >= SCORE_THRESHOLD_OBJECTIVE;
    }
    checkContainsDoubleBonus(word: string, command: string): boolean {
        let doubleBonusCount = 0;
        const cmdElements = command.split(' ');
        const line = cmdElements[1][0].charCodeAt(0) - ASCI_A;
        const col = parseInt(cmdElements[1][1], 10);
        const dir = cmdElements[1][2];
        let cursorX = 0;
        let cursorY = 0;
        while (cursorX < word.length && cursorY < word.length) {
            if (matrixOfBonusPoints[line + cursorX][col + cursorY] === 2 || matrixOfBonusPoints[line + cursorX][col + cursorY] === VALEURDOUBLEMOT) {
                doubleBonusCount++;
            }
            if (dir === 'h') cursorY++;
            if (dir === 'v') cursorX++;
        }
        return doubleBonusCount >= DOUBLE_BONUS_OBJECTIVE;
    }
    checkTargetCompletion(target: Target, command: string): boolean {
        const word = command.split(' ')[2];
        switch (target.id) {
            case TARGET_ID0:
                // Vérifier l'objectif placer un mot qui donne 35 de score
                return this.checkScoreThresholdObjective(word, command);
            case TARGET_ID1:
                // Vérifier l'objectif placer u  mot qui contient au moins 4 voyelles
                return this.checkFourVowels(word);
            case TARGET_ID2:
                // Vérifier l'objectif Placer un mot qui contient 2 bonus double (X2)
                return this.checkContainsDoubleBonus(word, command);
            case TARGET_ID3:
                // Vérifier l'objectif Placer un mot dans la même direction pendant 3 tours consécutifs
                return this.checkConsecutiveDirection(command);
            case TARGET_ID4:
                // Vérifier l'objectif Placer un mot qui contient 2 fois la même lettre
                return this.checkIfSameLetterOccurTwice(word);
            case TARGET_ID5:
                // Vérifier l'objectif Placer un palindrome
                return this.isPalindrome(word);
            case TARGET_ID6:
                // Vérifier l'objectif Placer un mot de plus de 5 lettres
                return word.length > FIVE_LETTER_WORD;
            case TARGET_ID7:
                // Vérifier l'objectif Placer un mot contenant la lettre Y
                return word.includes('y') || word.includes('Y');
            default:
                return false;
        }
    }
}
