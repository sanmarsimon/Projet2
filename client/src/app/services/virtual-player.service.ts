/* eslint-disable max-lines */
/* eslint-disable no-bitwise */
import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Target } from '@app/classes/target';
import { Utils } from '@app/classes/utils';
import {
    boardTracker,
    CHAR_H_IN_DEC,
    EXCHANGE_LETTER,
    FIRST_TURN_CASE,
    HARD_LEVEL,
    INCREMENTATION_SCORE,
    MAX_ALTERNATIVES,
    MAX_LENGTH_LINE,
    MAX_LETTERS,
    NAME_MAX_LENGTH_MINUS,
    PROBA_EXCHANGE_LETTER,
    PROBA_LETTER_PLACEMENT_MIDDLE,
    PROBA_LETTER_PLACEMENT_MIN,
    PROBA_PASS_ROUND,
    REGULAR_LEVEL,
    SCORE_PROBA_FIRST_MAX,
    SCORE_PROBA_FIRST_MIN,
    SCORE_PROBA_MIN,
    SCORE_PROBA_SECOND_MAX,
    SCORE_PROBA_SECOND_MIN,
} from '@app/constant';
import { Position } from '@app/interfaces/position';
import { ScoredPosition } from '@app/interfaces/scored-position';
import dictionnary_key_value from '@assets/dictionnary_key_value.json';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { LettersStockService } from './letters-stock.service';
import { PlayerService } from './player.service';
import { TargetValidationService } from './target-validation.service';
import { WordAction } from './word-action-solo.service';
@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    isTurn: boolean;
    isFirstTurn = true;
    letters: Letter[] = [];
    timeLeftJv: number;
    currentScore: number = 0;
    virtualPlayerBoard = '';
    allCombinations: string[] = [];
    playerName: string;
    utils: Utils = new Utils();
    result = '';
    allowedPostions: Position[] = [];
    scoredPositions: ScoredPosition[] = [];
    socket;
    difficulty: string = REGULAR_LEVEL;
    alternativeCommands: string[] = [];
    allowedFirstPositions: string[] = [];
    privateTarget: Target;
    publicTargets: Target[] = [];
    readonly uri: string = 'ws://localhost:3000';
    constructor(
        private letterStockService: LettersStockService,
        private wordAction: WordAction,
        private targetValidation: TargetValidationService,
        private playerService: PlayerService, // private gameMasterService: GameMasterService,
    ) {
        this.letters = this.letterStockService.getFromStock(MAX_LETTERS);
        this.socket = io(this.uri);
        if (this.playerService.privateTarget !== undefined) {
            this.privateTarget = new Target(
                this.playerService.privateTarget.id,
                this.playerService.privateTarget.description,
                this.playerService.privateTarget.points,
                this.playerService.privateTarget.totalOccurencesToComplete,
            );
        }
        if (this.playerService.publicTargets?.length > 0) {
            for (const target of this.playerService.publicTargets) {
                this.publicTargets.push(new Target(target.id, target.description, target.points, target.totalOccurencesToComplete));
            }
        }
    }
    initVirtualPlayerBoard() {
        this.virtualPlayerBoard = this.utils.letterArrayToString(this.letters);
    }
    listen(eventName: string): Observable<string> {
        return new Observable<string>((subscriber) => {
            this.socket.on(eventName, (data: string) => {
                subscriber.next(data);
                subscriber.complete();
            });
        });
    }
    updateTargets(command: string) {
        // if (this.gameMasterService.gameMode === SINGLE_PLAYER_MODE) {
        // }
        if (
            this.privateTarget !== undefined &&
            this.privateTarget?.completion < this.privateTarget?.totalOccurencesToComplete &&
            this.playerService.privateTarget?.completion < this.playerService.privateTarget?.totalOccurencesToComplete
        ) {
            if (this.targetValidation.checkTargetCompletion(this.privateTarget, command)) {
                this.privateTarget.completion++;
                if (this.privateTarget.completion === this.privateTarget.totalOccurencesToComplete) {
                    // Add the target bonus points to the current score
                    this.playerService.gainedPointsOpponent(this.privateTarget.points);
                    // this.playerService.privateTarget.completion = this.playerService.privateTarget.totalOccurencesToComplete + 1;
                }
            }
        }
        if (this.publicTargets?.length > 0 && this.playerService.publicTargets?.length > 0) {
            let index = 0;
            for (const target of this.publicTargets) {
                if (
                    this.targetValidation.checkTargetCompletion(target, command) &&
                    target.completion < target.totalOccurencesToComplete &&
                    this.playerService.publicTargets[index].completion < this.playerService.publicTargets[index].totalOccurencesToComplete
                ) {
                    target.completion += 1;
                    if (target.completion === target.totalOccurencesToComplete) {
                        this.playerService.gainedPointsOpponent(target.points);
                    }
                }
                index++;
            }
        }
    }
    playTurn(): string {
        if (this.difficulty === HARD_LEVEL) {
            return this.playTurnExpert();
        } else {
            return this.playTurnNormal();
        }
    }
    playTurnExpert(): string {
        let alternativePosition = '';
        let counter = 1;
        this.allCombinations = [];
        this.alternativeCommands = [];
        if (this.virtualPlayerBoard.length < MAX_LETTERS) {
            this.virtualPlayerBoard += this.utils.letterArrayToString(
                this.letterStockService.getFromStock(MAX_LETTERS - this.virtualPlayerBoard.length),
            );
        }
        this.generateAllPossibleSubstrings(this.virtualPlayerBoard);
        const dictCombinationsPossible = this.findCombinationsInDict();
        if (dictCombinationsPossible.length === 0) {
            this.isFirstTurn = false;
            this.exchangeAllLetters();
            return '!echanger ' + EXCHANGE_LETTER + ' lettres';
        }
        let rawChosen: Position;
        let foundPosition: ScoredPosition;
        const chosenWordIndex: number = this.chooseMostScoredWord(dictCombinationsPossible);
        let chosenPosition = '';
        if (this.isFirstTurn) {
            this.alternativeCommands = [];
            chosenPosition = this.generateFirstTurnPosition(dictCombinationsPossible[chosenWordIndex]);
            alternativePosition = '';
            counter = 1;
            while (counter < this.allowedFirstPositions.length && counter < MAX_ALTERNATIVES) {
                alternativePosition = this.allowedFirstPositions[counter];
                this.alternativeCommands.push(
                    'Alternative ' + (counter + 1) + ': !placer ' + alternativePosition + ' ' + dictCombinationsPossible[chosenWordIndex],
                );
                counter++;
            }
            this.isFirstTurn = false;
        } else {
            this.generateAllowedPositions(dictCombinationsPossible[chosenWordIndex]);
            this.calculatePositionScore(dictCombinationsPossible[chosenWordIndex]);
            foundPosition = this.scoredPositions[0];
            if (foundPosition === undefined) {
                this.isFirstTurn = false;
                return '!passer';
            }
            rawChosen = foundPosition.position;
            const wordMatrixTracker = [...boardTracker];
            while (wordMatrixTracker[rawChosen.coords[0]][rawChosen.coords[1]] !== '') {
                this.scoredPositions.shift();
                if (foundPosition === undefined) {
                    this.isFirstTurn = false;
                    return '!passer';
                }
                foundPosition = this.scoredPositions[0];
                rawChosen = foundPosition.position;
            }
            this.currentScore += foundPosition.score;
            chosenPosition = this.utils.convertPositionToString(rawChosen);
            alternativePosition = '';
            counter = 1;
            while (counter < this.scoredPositions.length && counter < MAX_ALTERNATIVES) {
                alternativePosition = this.utils.convertPositionToString(this.scoredPositions[counter].position);
                this.alternativeCommands.push(
                    'Alternative ' + (counter + 1) + ': !placer ' + alternativePosition + ' ' + dictCombinationsPossible[chosenWordIndex],
                );
                counter++;
            }
        }
        this.removeWordLettersFromBoard(dictCombinationsPossible[chosenWordIndex]);
        this.isFirstTurn = false;
        this.updateTargets('!placer ' + chosenPosition + ' ' + dictCombinationsPossible[chosenWordIndex]);
        return '!placer ' + chosenPosition + ' ' + dictCombinationsPossible[chosenWordIndex];
    }
    playTurnNormal(): string {
        this.alternativeCommands = [];
        const probability = Math.random();
        if (probability < PROBA_PASS_ROUND) {
            this.isFirstTurn = false;
            return '!passer';
        } else if (probability < PROBA_EXCHANGE_LETTER) {
            const changerdLetters = this.exchangeLetters();
            this.isFirstTurn = false;
            return '!echanger ' + changerdLetters + ' lettres';
        } else {
            let alternativePosition = '';
            let counter = 1;
            this.allCombinations = [];
            this.generateAllPossibleSubstrings(this.virtualPlayerBoard);
            const dictCombinationsPossible = this.findCombinationsInDict();
            if (dictCombinationsPossible.length === 0) {
                this.isFirstTurn = false;
                return '!passer';
            } else {
                let rawChosen: Position;
                let foundPosition: ScoredPosition;
                const randomWordIndex = Math.floor(Math.random() * dictCombinationsPossible.length);
                let chosenPosition = '';
                if (this.isFirstTurn) {
                    chosenPosition = this.generateFirstTurnPosition(dictCombinationsPossible[randomWordIndex]);
                    alternativePosition = '';
                    counter = 1;
                    while (counter < this.allowedFirstPositions.length && counter < MAX_ALTERNATIVES) {
                        alternativePosition = this.allowedFirstPositions[counter];
                        this.alternativeCommands.push(
                            'Alternative ' + (counter + 1) + ': !placer ' + alternativePosition + ' ' + dictCombinationsPossible[randomWordIndex],
                        );
                        counter++;
                    }
                    this.isFirstTurn = false;
                } else {
                    this.generateAllowedPositions(dictCombinationsPossible[randomWordIndex]);
                    this.calculatePositionScore(dictCombinationsPossible[randomWordIndex]);
                    this.scoredPositions.sort((a, b) => (a.score < b.score ? 1 : INCREMENTATION_SCORE));
                    foundPosition = this.findChosenPosition();
                    if (foundPosition === undefined) {
                        this.isFirstTurn = false;
                        return '!passer';
                    }
                    rawChosen = foundPosition.position;
                    const wordMatrixTracker = [...boardTracker];
                    while (wordMatrixTracker[rawChosen.coords[0]][rawChosen.coords[1]] !== '') {
                        this.scoredPositions.shift();
                        foundPosition = this.findChosenPosition();
                        if (foundPosition === undefined) {
                            this.isFirstTurn = false;
                            return '!passer';
                        }
                        rawChosen = foundPosition.position;
                    }
                    this.currentScore += foundPosition.score;
                    chosenPosition = this.utils.convertPositionToString(rawChosen);
                }
                this.removeWordLettersFromBoard(dictCombinationsPossible[randomWordIndex]);
                this.virtualPlayerBoard += this.utils.letterArrayToString(
                    this.letterStockService.getFromStock(MAX_LETTERS - this.virtualPlayerBoard.length),
                );
                this.isFirstTurn = false;
                alternativePosition = '';
                counter = 1;
                while (counter < this.scoredPositions.length && counter < MAX_ALTERNATIVES) {
                    alternativePosition = this.utils.convertPositionToString(this.scoredPositions[counter].position);
                    this.alternativeCommands.push(
                        'Alternative ' + (counter + 1) + ': !placer ' + alternativePosition + ' ' + dictCombinationsPossible[randomWordIndex],
                    );
                    counter++;
                }
                this.updateTargets('!placer ' + chosenPosition + ' ' + dictCombinationsPossible[randomWordIndex]);
                return '!placer ' + chosenPosition + ' ' + dictCombinationsPossible[randomWordIndex];
            }
        }
    }
    setIsFisrtTurn(isFirstTurn: boolean) {
        this.isFirstTurn = isFirstTurn;
    }
    updateTracker(word: string, row: number, col: number, orientation: string) {
        if (orientation === 'v') {
            for (let i = 0; i < word.length; i++) {
                boardTracker[row + i][col] = word[i];
            }
        } else {
            for (let i = 0; i < word.length; i++) {
                boardTracker[row][col + i] = word[i];
            }
        }
    }
    generateFirstTurnPosition(word: string): string {
        const result: string[] = ['h8h', 'h8v'];
        for (let i = 1; i < word.length; i++) {
            result.push('h' + (FIRST_TURN_CASE - i) + 'h');
            result.push(String.fromCharCode(CHAR_H_IN_DEC - i) + '8v');
        }
        this.allowedFirstPositions = result;
        const randomPositionIndex = Math.floor(Math.random() * result.length);
        return result[randomPositionIndex];
    }
    findChosenPosition() {
        const scoreProbability = Math.random();
        this.scoredPositions.sort((a, b) => (a.score < b.score ? 1 : INCREMENTATION_SCORE));
        if (scoreProbability < PROBA_LETTER_PLACEMENT_MIDDLE) {
            const filteredPosition = this.scoredPositions.filter(
                (position) => position.score > SCORE_PROBA_SECOND_MIN && position.score < SCORE_PROBA_SECOND_MAX,
            );
            if (filteredPosition.length === 0) return this.scoredPositions[0];
            return filteredPosition[0];
        } else if (scoreProbability < PROBA_LETTER_PLACEMENT_MIN) {
            const filteredPosition = this.scoredPositions.filter(
                (position) => position.score > SCORE_PROBA_FIRST_MIN && position.score < SCORE_PROBA_FIRST_MAX,
            );
            if (filteredPosition.length === 0) return this.scoredPositions[0];
            return filteredPosition[0];
        } else {
            const filteredPosition = this.scoredPositions.filter((position) => position.score > SCORE_PROBA_MIN);
            return filteredPosition[0];
        }
    }
    calculatePositionScore(word: string) {
        this.scoredPositions = [];
        for (const position of this.allowedPostions) {
            this.scoredPositions.push({
                position,
                score: this.wordAction.calculateScore(word, position.coords[0], position.coords[1], position.orientation, false),
            });
        }
    }
    findEmptyPossiblePositions(): Position[] {
        this.allowedPostions = [];
        const wordMatrix = [...boardTracker];
        for (let i = 0; i < MAX_LENGTH_LINE; i++) {
            for (let j = 0; j < MAX_LENGTH_LINE; j++) {
                if (wordMatrix[i][j] !== '') {
                    if (j - 1 >= 0 && wordMatrix[i][j - 1] === '')
                        this.allowedPostions.push({
                            coords: [i, j - 1],
                            orientation: 'v',
                        });
                    if (i - 1 >= 0 && wordMatrix[i - 1][j] === '')
                        this.allowedPostions.push({
                            coords: [i - 1, j],
                            orientation: 'h',
                        });
                    if (j + 1 < MAX_LENGTH_LINE && wordMatrix[i][j + 1] === '')
                        this.allowedPostions.push({
                            coords: [i, j + 1],
                            orientation: 'v',
                        });
                    if (i + 1 < MAX_LENGTH_LINE && wordMatrix[i + 1][j] === '')
                        this.allowedPostions.push({
                            coords: [i + 1, j],
                            orientation: 'h',
                        });
                }
            }
        }
        const allowedPostionsCopy = [...this.allowedPostions];
        return allowedPostionsCopy;
    }
    generateWordLengthPositions(word: string, allowedPostions: Position[]) {
        for (const poisition of allowedPostions) {
            if (poisition.orientation === 'v') {
                for (let i = 1; i < word.length; i++) {
                    if (poisition.coords[0] + i > NAME_MAX_LENGTH_MINUS || poisition.coords[0] - i < 0) break;
                    this.allowedPostions.push({
                        coords: [poisition.coords[0] - i, poisition.coords[1]],
                        orientation: 'v',
                    });
                }
            } else {
                for (let i = 1; i < word.length && poisition.coords[0] + i < NAME_MAX_LENGTH_MINUS && poisition.coords[0] - i > 0; i++) {
                    if (poisition.coords[1] + i > NAME_MAX_LENGTH_MINUS || poisition.coords[1] - i < 0) break;
                    this.allowedPostions.push({
                        coords: [poisition.coords[0], poisition.coords[1] - i],
                        orientation: 'h',
                    });
                }
            }
        }
    }
    filterNonAllowedPositions(word: string, allowedPostions: Position[]): Position[] {
        const finalAllowedPositions: Position[] = [];
        const wordMatrix = [...boardTracker];
        let availablePosition: boolean;
        for (const position of allowedPostions) {
            availablePosition = true;
            let tempWord = '';
            for (let i = 0; i < word.length; i++) {
                if (position.coords[0] + i > NAME_MAX_LENGTH_MINUS || position.coords[0] + i < 0) {
                    availablePosition = false;
                    break;
                }
                if (position.coords[1] + i > NAME_MAX_LENGTH_MINUS || position.coords[1] + i < 0) {
                    availablePosition = false;
                    break;
                }
                if (position.orientation === 'v') {
                    tempWord += wordMatrix[position.coords[0] + i][position.coords[1]];
                    if (wordMatrix[position.coords[0] + i][position.coords[1]] !== '') {
                        availablePosition = false;
                        break;
                    }
                } else {
                    tempWord += wordMatrix[position.coords[0]][position.coords[1] + i];
                    if (wordMatrix[position.coords[0]][position.coords[1] + i] !== '') {
                        availablePosition = false;
                        break;
                    }
                }
            }
            if (availablePosition === true && tempWord === '' && wordMatrix[position.coords[0]][position.coords[1]] === '')
                finalAllowedPositions.push(position);
        }
        return finalAllowedPositions;
    }
    generateAllowedPositions(word: string) {
        let allowedPostionsCopy = this.findEmptyPossiblePositions();
        this.generateWordLengthPositions(word, allowedPostionsCopy);
        allowedPostionsCopy = [...this.allowedPostions];
        const finalAllowedPositions: Position[] = this.filterNonAllowedPositions(word, allowedPostionsCopy);
        this.allowedPostions = [];
        this.allowedPostions = finalAllowedPositions;
    }
    exchangeLetters(): number {
        const letterCount = Math.floor(Math.random() * EXCHANGE_LETTER) + 1;
        const virtualPlayerBoardCopy = this.virtualPlayerBoard.slice();
        let lettersToExchange = '';
        let i = 0;
        while (i < letterCount) {
            i++;
            const letterIndex = Math.floor(Math.random() * (EXCHANGE_LETTER - i));
            lettersToExchange += virtualPlayerBoardCopy[letterIndex];
            this.virtualPlayerBoard = this.virtualPlayerBoard.replace(this.virtualPlayerBoard[letterIndex], '');
        }
        let exchangedLetters = this.letterStockService.swapLetters(this.utils.stringToLetterArray(lettersToExchange));
        if (exchangedLetters == null) exchangedLetters = [];
        this.virtualPlayerBoard += this.utils.letterArrayToString(exchangedLetters);
        return letterCount;
    }
    exchangeAllLetters(): void {
        const virtualPlayerBoardCopy = this.virtualPlayerBoard.slice();
        let lettersToExchange = '';
        let i = 0;
        while (i < EXCHANGE_LETTER) {
            i++;
            const letterIndex = Math.floor(Math.random() * (EXCHANGE_LETTER - i));
            lettersToExchange += virtualPlayerBoardCopy[letterIndex];
            this.virtualPlayerBoard = this.virtualPlayerBoard.replace(this.virtualPlayerBoard[letterIndex], '');
        }
        let exchangedLetters = this.letterStockService.swapLetters(this.utils.stringToLetterArray(lettersToExchange));
        if (exchangedLetters == null) exchangedLetters = [];
        this.virtualPlayerBoard += this.utils.letterArrayToString(exchangedLetters);
    }
    setVirtualPlayerBoard(newBoardValue: string) {
        this.virtualPlayerBoard = newBoardValue;
    }
    setVirtualPlayerName(playerName: string): void {
        this.playerName = playerName;
    }
    getVirtualPlayerName(): string {
        return this.playerName;
    }
    generateRandomLetters(length: number) {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters[Math.floor(Math.random() * charactersLength)];
        }
        return result;
    }
    findCombinationsInDict(): string[] {
        const combinations: string[] = [];
        const dictWords = JSON.parse(JSON.stringify(dictionnary_key_value));
        let iterator = 0;
        if (this.difficulty === HARD_LEVEL) {
            while (iterator <= this.allCombinations.length) {
                const word = this.allCombinations[iterator];
                if (dictWords[word] === true && word.length > 2) combinations.push(word);
                iterator++;
            }
        } else {
            while (combinations.length < 3 && iterator <= this.allCombinations.length) {
                const word = this.allCombinations[iterator];
                if (dictWords[word] === true && word.length > 2) combinations.push(word);
                iterator++;
            }
        }
        return combinations;
    }
    generateAllPossibleSubstrings(board: string): void {
        const boardArray = board.split('');
        const hash: {
            [key: string]: boolean;
        } = {};
        const res: string[] = [];
        boardArray.sort();
        const len = Math.pow(2, boardArray.length);
        for (let i = 1; i < len; i++) {
            const lineRes = [];
            for (let innerPos = 0; innerPos < boardArray.length; innerPos++) {
                const mask = 1 << innerPos;
                if (mask & i) {
                    lineRes.push(boardArray[innerPos]);
                }
            }
            do {
                const hashKey: string = lineRes.slice().join('');
                if (hash[hashKey] === undefined) {
                    res.push(lineRes.slice().join(''));
                    hash[hashKey] = true;
                }
            } while (this.utils.nextPermutation(lineRes));
        }
        this.allCombinations = res;
    }
    removeWordLettersFromBoard(word: string): void {
        for (const i of word) {
            this.virtualPlayerBoard = this.virtualPlayerBoard.replace(i, '');
        }
    }

    chooseMostScoredWord(wordList: string[]): number {
        let chosenWordIndex = 0;
        let chosenWordScore = 0;
        for (let i = 0; i < wordList.length; i++) {
            let currScore = 0;
            for (const letter of wordList[i]) {
                currScore += this.letterStockService.getLetterScore(letter);
            }
            if (currScore > chosenWordScore) {
                chosenWordScore = currScore;
                chosenWordIndex = i;
            }
        }
        return chosenWordIndex;
    }
}
