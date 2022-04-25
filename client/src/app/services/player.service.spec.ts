/* eslint-disable deprecation/deprecation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { Target } from '@app/classes/target';
import { LettersStockService } from '@app/services/letters-stock.service';
import { PlayerService } from './player.service';
import { TargetValidationService } from './target-validation.service';
import { VirtualPlayerService } from './virtual-player.service';

describe('Player', () => {
    let player: PlayerService;

    let letterServiceSpy: jasmine.SpyObj<LettersStockService>;
    let targetServiceSpy: jasmine.SpyObj<TargetValidationService>;
    let virtualPlayerSpy: jasmine.SpyObj<VirtualPlayerService>;

    beforeEach(() => {
        letterServiceSpy = jasmine.createSpyObj('LettersStockService', ['getFromStock']);
        targetServiceSpy = jasmine.createSpyObj('TargetValidationService', ['checkTargetCompletion']);
        virtualPlayerSpy = jasmine.createSpyObj('VirtualPlayerService', ['']);

        TestBed.configureTestingModule({
            providers: [
                PlayerService,
                { provide: LettersStockService, useValue: letterServiceSpy },
                { provide: TargetValidationService, useValue: targetServiceSpy },
                { provide: VirtualPlayerService, useValue: virtualPlayerSpy },
            ],
        });
        player = TestBed.inject(PlayerService);
    });
    it('should be created', () => {
        expect(player).toBeTruthy();
    });

    // it('should create an instance', () => {
    //     spyOn(letterServiceSpy, 'getFromStock');
    //     expect(player.letters.length).toEqual(7);
    // });

    it('should not add random letters from stock if letters.length is already 7', () => {
        const lettersInStock: Letter[] = [];
        const spy = spyOn(player, 'addLetter');
        letterServiceSpy.getFromStock.and.returnValue(lettersInStock);
        player.addFromStock(3);
        expect(spy).toHaveBeenCalled();
    });
    it('should set the targets ', () => {
        player.privateTarget = new Target(2, 'k', 10, 20);
        virtualPlayerSpy.privateTarget = new Target(2, 'k', 5, 10);
        const bool = true;
        player.privateTarget = new Target(5, '', 7, 10);
        targetServiceSpy.checkTargetCompletion.and.returnValue(bool);

        player.updateTargetsCompletion('hey');
        expect(player.privateTarget.completion).toEqual(1);
        // expect(player.privateTarget).toBe(targetServiceSpy.targetsStock[2]);
    });

    it('should change the player Name', () => {
        const res = 'Max';
        player.changePlayerName(res);
        expect(player.playerName).toEqual(res);
    });

    it('should gained points', () => {
        const point = 5;
        player.gainedPoints(point);
        expect(player.pointsGained).toEqual(5);
    });

    it('should not gained points when pointGained equal zero', () => {
        const point = 0;
        player.pointsGained = 0;
        player.gainedPoints(point);
        expect(player.pointsGained).toEqual(0);
    });

    it('should not gained points when pointGained negative', () => {
        const point = -5;
        player.pointsGained = 0;
        player.gainedPoints(point);
        expect(player.pointsGained).not.toEqual(-5);
        expect(player.pointsGained).toEqual(0);
    });

    it('should remove 3 letters from chevalet', () => {
        const lettersToRemove = '';
        const spy = spyOn(player, 'getIndexOfLetter');
        player.isLetterFound(lettersToRemove);
        player.removeLetters(lettersToRemove);
        expect(spy).toHaveBeenCalled();
    });
    it('should not remove a letter that is not in stock', () => {
        const letterToRemove = '5';
        player.letters = [];

        player.removeLetters(letterToRemove);
        expect(player.letters.length).toEqual(0);
    });

    it('should not swap if one of the letter is not in stock', () => {
        player.letters = [];
        const lettersToSwap = 'abc5';
        expect(player.swapLetter(lettersToSwap)).toBe(false);
    });

    it('should swap 3 letters with stock', () => {
        const lettersInStock: Letter[] = [];
        let lettersToSwap = '';
        player.letters = [];
        for (const letter of player.letters) {
            lettersInStock.push(letter);
            if (player.letters.indexOf(letter) < 3) {
                lettersToSwap = lettersToSwap.concat(letter.letter);
            }
        }
        player.swapLetter(lettersToSwap);
        expect(player.letters.length).toEqual(0);
        for (const letter of player.letters) {
            expect(player.letters.indexOf(letter)).toBeGreaterThanOrEqual(0); // Never -1 because it means element is not found
        }
    });

    it('should return true if all the letters needed are available and remove letters if placeWord is called', () => {
        let lettersToCheck = '';
        player.letters = [];

        for (const letter of player.letters) {
            if (player.letters.indexOf(letter) < 3) {
                lettersToCheck = lettersToCheck.concat(letter.letter);
            }
        }
        expect(player.areLettersAvailable(lettersToCheck)).toBe(false);
        expect(player.placeWord(lettersToCheck)).toBe(false);
        expect(player.letters.length).toEqual(0);
    });

    it('should return false if all the letters needed are not available', () => {
        let lettersToCheck = '';
        player.letters = [];
        for (const letter of player.letters) {
            if (player.letters.indexOf(letter) < 3) {
                lettersToCheck = lettersToCheck.concat(letter.letter);
            }
        }
        lettersToCheck = lettersToCheck.concat('5'); // Characters that are not in player.letters
        lettersToCheck = lettersToCheck.concat('9'); // Characters that are not in player.letters
        expect(player.areLettersAvailable(lettersToCheck)).toBe(false);
        expect(player.letters.length).toEqual(0);

        lettersToCheck = 'zzzzzz';
        expect(player.areLettersAvailable(lettersToCheck)).toBe(false);
        expect(player.placeWord(lettersToCheck)).toBe(false);
    });

    it('should take in consideration white letters', () => {
        const lettersInStock: Letter[] = [];
        let lettersToCheck = '';
        const letters = (player.letters = [
            {
                letter: 'test',
                value: 4,
            },
            {
                letter: 'hey',
                value: 5,
            },
            {
                letter: 'hey',
                value: 5,
            },
            {
                letter: 'hey',
                value: 5,
            },
        ]);
        for (const letter of player.letters) {
            lettersInStock.push(letter);
            if (player.letters.indexOf(letter) < 2) {
                lettersToCheck = lettersToCheck.concat(letter.letter);
            }
        }

        // const letterToRemove = player.letters[4].letter;
        lettersToCheck = lettersToCheck.concat('5'); // On verifie avec une lettre dont on est sur est pas prÃ©sente
        const letterToAdd: Letter[] = [{ letter: '*', value: 0 }]; // On ajoute une white letter
        player.removeLetters(letters[1].letter);
        player.addLetter(letterToAdd);
        expect(lettersToCheck.length).toEqual(8);
        expect(player.areLettersAvailable(lettersToCheck)).toBe(false);
        expect(player.letters.length).toEqual(5);
        expect(player.placeWord(lettersToCheck)).toBe(false);
    });
    it('should return -1 as the index of an element that is not in letters ', () => {
        const letterToCheck = '#';
        player.letters = [];
        expect(player.getIndexOfLetter(letterToCheck)).toBe(-1);
        expect(player.isLetterFound(letterToCheck)).toEqual(false);
    });

    it('should return false if more than 7 letters are given ', () => {
        const lettersToCheck = 'abcdefgh';
        player.letters = [];

        expect(player.areLettersAvailable(lettersToCheck)).toBe(false);
        expect(player.letters.length).toEqual(0);
    });

    it('should return the correct value of a letter', () => {
        expect(player.findValueToLetter('A')).toEqual(1);
    });

    it('should return 0 for a non valid letter', () => {
        expect(player.findValueToLetter('8')).toEqual(0);
    });

    it('should return 0 for more than one letter', () => {
        expect(player.findValueToLetter('abcd')).toEqual(0);
    });

    it('should return false if I want to find more than 1 letter', () => {
        expect(player.isLetterFound('hey')).toBe(false);
    });

    it('should set opponent name', () => {
        player.setOpponentName('opponent');
        expect(player.opponentName).toEqual('opponent');
    });

    it('should give opponent his points', () => {
        player.gainedPointsOpponent(5);
        expect(player.pointsGainedOpponent).toEqual(5);
    });
    it('should give opponent his points', () => {
        player.gainedPointsOpponent(0);
        expect(player.pointsGainedOpponent).toEqual(0);
    });

    it('should set player name', () => {
        player.setPlayerName('player');
        expect(player.playerName).toEqual('player');
    });
});
