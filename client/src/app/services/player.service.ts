import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Target } from '@app/classes/target';
import { ELEMENT_NOT_FOUNDED, MAX_NUMBER_LETTER } from '@app/constant';
import { LettersStockService } from '@app/services/letters-stock.service';
import { TargetValidationService } from '@app/services/target-validation.service';
import letterBank from '@assets/letter-bank';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    privateTarget: Target;
    publicTargets: Target[] = [];
    publicTargetIndexes: number[] = [];
    playerName: string;
    isTurn: boolean;
    letters: Letter[] = [];
    pointsGained: number = 0;
    pointsGainedOpponent: number = 0;
    opponentName: string = 'placeholder';
    opponentPrivateTarget: Target;
    room: string = '';
    constructor(
        private letterService: LettersStockService,
        private targetService: TargetValidationService,
        private virtualPlayer: VirtualPlayerService,
        private multiplayerService: MultiplayerService,
    ) {
        this.letters = this.letterService.getFromStock(MAX_NUMBER_LETTER);
    }
    findValueToLetter(word: string): number {
        let score = 0;
        if (word.length === 1) {
            letterBank.bank.forEach((element) => {
                if (element.letter === word[0].toUpperCase()) {
                    score = element.value;
                }
            });
        }
        return score;
    }
    changePlayerName(newName: string) {
        this.playerName = newName;
    }
    setOpponentName(opponentName: string) {
        this.opponentName = opponentName;
    }
    gainedPoints(pointGained: number) {
        if (pointGained > 0) {
            this.pointsGained += pointGained;
        }
    }
    gainedPointsOpponent(pointGained: number) {
        if (pointGained !== 0) {
            this.pointsGainedOpponent += pointGained;
        }
    }
    addLetter(lettres: Letter[]) {
        lettres.forEach((element) => {
            if (this.letters.length < MAX_NUMBER_LETTER) {
                this.letters.push(new Letter(element.letter, element.value));
            }
        });
    }
    addFromStock(quantity: number) {
        this.addLetter(this.letterService.getFromStock(quantity));
    }
    getIndexOfLetter(letterToFind: string): number {
        if (letterToFind.length === 1) {
            for (const letter of this.letters) {
                if (letter.letter === letterToFind) {
                    return this.letters.indexOf(letter);
                }
            }
        }
        return ELEMENT_NOT_FOUNDED;
    }
    isLetterFound(letterToFind: string): boolean {
        return this.getIndexOfLetter(letterToFind) === ELEMENT_NOT_FOUNDED ? false : true;
    }
    removeLetters(lettersToRemove: string) {
        for (const letter of lettersToRemove) {
            if (this.isLetterFound(letter)) {
                this.letters.splice(this.getIndexOfLetter(letter), 1);
            } else if (this.isLetterFound('*')) {
                this.letters.splice(this.getIndexOfLetter('*'), 1);
            }
        }
    }
    swapLetter(lettersToSwap: string): boolean {
        const lettersToExchange: Letter[] = [];
        const indexesOfAlreadyUsedLetters: number[] = [];
        const chars = lettersToSwap.split('');
        for (const currentLetter of chars) {
            for (let i = 0; i < this.letters.length; i++) {
                if (this.letters[i].letter === currentLetter && indexesOfAlreadyUsedLetters.indexOf(i) === ELEMENT_NOT_FOUNDED) {
                    lettersToExchange.push(this.letters[i]);
                    indexesOfAlreadyUsedLetters.push(i);
                    break;
                }
            }
        }
        if (lettersToExchange.length === 0 || lettersToExchange.length !== lettersToSwap.length) {
            return false;
        }
        const newLetters: Letter[] = this.letterService.swapLetters(lettersToExchange);
        for (let index = 0; index < lettersToExchange.length; index++) {
            this.letters[this.letters.indexOf(lettersToExchange[index])] = newLetters[index];
        }
        return true;
    }
    placeWord(word: string): boolean {
        if (this.areLettersAvailable(word)) {
            this.removeLetters(word);
            return true;
            // Word ready to be placed on the grid
        }
        return false;
    }
    areLettersAvailable(lettersToVerify: string): boolean {
        const whiteLetter = '*';
        let numberOfWhiteLettersAvailable = 0;
        for (const letter of this.letters) {
            if (letter.letter === whiteLetter) {
                numberOfWhiteLettersAvailable++;
            }
        }
        if (lettersToVerify === '' || lettersToVerify.length > MAX_NUMBER_LETTER) {
            return false;
        }
        let lettersFound = '';
        for (const letter of lettersToVerify) {
            if (this.isLetterFound(letter)) {
                lettersFound = lettersFound.concat(letter);
            } else {
                if (this.isLetterFound('*') && numberOfWhiteLettersAvailable > 0) {
                    lettersFound = lettersFound.concat('*');
                    numberOfWhiteLettersAvailable--;
                } else {
                    return false;
                }
            }
        }
        return true;
    }
    setPlayerName(name: string) {
        this.playerName = name;
    }
    // Fonctions pour les objectifs (targets)
    setTargets(room: string) {
        this.room = room;
        const privateTargetIndex = Math.floor(Math.random() * this.targetService.targetsStock.length);
        this.privateTarget = this.targetService.targetsStock[privateTargetIndex];
        let currentTargetIndex = privateTargetIndex;
        let nextIndex = currentTargetIndex;
        const numberOfPublicTargets = 2;
        const publicTargetsIds: number[] = [];
        while (this.publicTargets.length < numberOfPublicTargets) {
            nextIndex = Math.floor(Math.random() * this.targetService.targetsStock.length);
            if (nextIndex !== currentTargetIndex && nextIndex !== privateTargetIndex) {
                this.publicTargets.push(this.targetService.targetsStock[nextIndex]);
                publicTargetsIds.push(nextIndex);
                currentTargetIndex = nextIndex;
            }
        }
        this.assignVirtualPlayerTargets();
        this.multiplayerService.setTargets(room, publicTargetsIds);
    }
    setPublicTargets(room: string, targetsIds: number[]) {
        this.room = room;
        this.publicTargets = [];
        for (const targetId of targetsIds) {
            this.publicTargets.push(
                new Target(
                    targetId,
                    this.targetService.targetsStock[targetId].description,
                    this.targetService.targetsStock[targetId].points,
                    this.targetService.targetsStock[targetId].totalOccurencesToComplete,
                ),
            );
        }
        // Set the private target different from the public targets
        let currentTargetIndex = Math.floor(Math.random() * this.targetService.targetsStock.length);
        while (targetsIds.indexOf(currentTargetIndex) !== ELEMENT_NOT_FOUNDED) {
            currentTargetIndex = Math.floor(Math.random() * this.targetService.targetsStock.length);
        }
        this.privateTarget = new Target(
            currentTargetIndex,
            this.targetService.targetsStock[currentTargetIndex].description,
            this.targetService.targetsStock[currentTargetIndex].points,
            this.targetService.targetsStock[currentTargetIndex].totalOccurencesToComplete,
        );
        this.assignVirtualPlayerTargets();
    }
    assignVirtualPlayerTargets() {
        this.virtualPlayer.privateTarget = new Target(
            this.privateTarget.id,
            this.privateTarget.description,
            this.privateTarget.points,
            this.privateTarget.totalOccurencesToComplete,
        );
        this.virtualPlayer.publicTargets = [];
        for (const target of this.publicTargets) {
            this.virtualPlayer.publicTargets.push(new Target(target.id, target.description, target.points, target.totalOccurencesToComplete));
        }
    }
    updateTargetsCompletion(command: string) {
        if (
            this.privateTarget !== undefined &&
            this.privateTarget?.completion < this.privateTarget?.totalOccurencesToComplete &&
            this.virtualPlayer?.privateTarget?.completion < this.virtualPlayer.privateTarget?.totalOccurencesToComplete
        ) {
            if (this.targetService.checkTargetCompletion(this.privateTarget, command)) {
                this.privateTarget.completion++;
                if (this.privateTarget.completion === this.privateTarget.totalOccurencesToComplete) {
                    this.gainedPoints(this.privateTarget.points);
                    this.multiplayerService.updateTargetCompletion(this.room, this.playerName, this.privateTarget.id);
                }
            }
        }
        if (this.publicTargets?.length > 0 && this.virtualPlayer.publicTargets?.length > 0) {
            let index = 0;
            for (const target of this.publicTargets) {
                if (
                    this.targetService.checkTargetCompletion(target, command) &&
                    target.completion < target.totalOccurencesToComplete &&
                    this.virtualPlayer.publicTargets[index].completion < this.virtualPlayer.publicTargets[index].totalOccurencesToComplete
                ) {
                    target.completion += 1;
                    if (target.completion === target.totalOccurencesToComplete) {
                        this.gainedPoints(target.points);
                        this.multiplayerService.updateTargetCompletion(this.room, this.playerName, target.id);
                    }
                }
                index++;
            }
        }
    }
    updateOpponentTargetCompletion(targetId: number) {
        for (const target of this.publicTargets) {
            if (target.id === targetId) {
                target.completion = target.totalOccurencesToComplete;
                return;
            }
        }
        // If the target is private
        this.opponentPrivateTarget = new Target(
            targetId,
            this.targetService.targetsStock[targetId].description,
            this.targetService.targetsStock[targetId].points,
            this.targetService.targetsStock[targetId].totalOccurencesToComplete,
        );
        this.opponentPrivateTarget.completion = this.opponentPrivateTarget.totalOccurencesToComplete;
    }
}
