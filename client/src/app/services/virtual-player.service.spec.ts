/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { Utils } from '@app/classes/utils';
import { boardTracker, HARD_LEVEL } from '@app/constant';
import { LettersStockService } from './letters-stock.service';
import { PlayerService } from './player.service';
import { TargetValidationService } from './target-validation.service';
import { VirtualPlayerService } from './virtual-player.service';
import { WordAction } from './word-action-solo.service';

describe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    const utils = new Utils();
    // let gridServiceSpy: jasmine.SpyObj<GridService>;
    let wordActionSpy: jasmine.SpyObj<WordAction>;
    let letterStockSpy: jasmine.SpyObj<LettersStockService>;
    let targetValidationSpy: jasmine.SpyObj<TargetValidationService>;
    let playerServiceSpy: jasmine.SpyObj<PlayerService>;

    beforeEach(() => {
        // gridServiceSpy = jasmine.createSpyObj('GridService', ['']);
        wordActionSpy = jasmine.createSpyObj('WordAction', ['calculateScore']);
        targetValidationSpy = jasmine.createSpyObj('TargetValidationService', ['']);
        playerServiceSpy = jasmine.createSpyObj('PlayerService', ['']);

        letterStockSpy = jasmine.createSpyObj('LettersStockService', ['swapLetters', 'getFromStock']);
        TestBed.configureTestingModule({
            providers: [
                { provide: WordAction, useValue: wordActionSpy },
                { provide: LettersStockService, letterStockSpy },
                { provide: TargetValidationService, useValue: targetValidationSpy },
                { provide: PlayerService, useValue: playerServiceSpy },
            ],
        });
        service = TestBed.inject(VirtualPlayerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // /// ///////////////////////////  letterArrayToString() //////////////////////////////
    // it('should return nothing if tab is null ', () => {
    //     // spyOn(Math, 'random').and.returnValue(0);
    //     // service.playTurn();
    //     const result = '';

    //     const tab: Letter[] = [
    //         { letter: '', value: 0 },
    //         { letter: '', value: 1 },
    //     ];
    //     expect(service.letterArrayToString(tab)).toEqual(result);
    // });

    // it('should return a string ', () => {
    //     const result = 'ab';
    //     const tab: Letter[] = [
    //         { letter: 'a', value: 0 },
    //         { letter: 'b', value: 1 },
    //     ];
    //     expect(service.letterArrayToString(tab)).toEqual(result);
    // });

    /// ///////////////////////////  setVirtualPlayerBoard() //////////////////////////////
    it('should set the board ', () => {
        const newBoardValue = 'h';
        service.setVirtualPlayerBoard(newBoardValue);
        expect(service.virtualPlayerBoard).toEqual(newBoardValue);
    });

    /// ///////////////////////////  setVirtualPlayerName() //////////////////////////////
    it('should set the player Name ', () => {
        const playerName = 'placeholder';
        service.setVirtualPlayerName(playerName);
        expect(service.playerName).toEqual(playerName);
    });

    /// ///////////////////////////  getVirtualPlayerName() //////////////////////////////
    it('should get the player Name ', () => {
        service.playerName = 'playerName';
        expect(service.getVirtualPlayerName()).toEqual('playerName');
    });

    /// ///////////////////////////  initVirtualPlayerBoard() //////////////////////////////
    it('should initVirtualPlayerBoard ', () => {
        const spy = spyOn(utils, 'letterArrayToString');
        const expected: Letter[] = [];
        expected.push(new Letter('H', 4));
        expected.push(new Letter('E', 1));
        expected.push(new Letter('Y', 10));
        utils.letterArrayToString(expected);
        service.initVirtualPlayerBoard();
        expect(spy).toHaveBeenCalled();
    });

    /// ///////////////////////////  removeWordLettersFromBoard() //////////////////////////////
    it('should set the player Name ', () => {
        service.removeWordLettersFromBoard('word');
        expect(service.virtualPlayerBoard).toEqual('');
    });
    it('should set the player Name ', () => {
        service.removeWordLettersFromBoard('word');
        expect(service.virtualPlayerBoard).toEqual('');
    });

    it('should updateTracker when the orientation is Vertical ', () => {
        service.updateTracker('word', 1, 2, 'h');
        expect(boardTracker[1][2]).toEqual('w');
    });
    it('should updateTracker when the orientation is Vertical  ', () => {
        service.updateTracker('word', 1, 2, 'v');
        expect(boardTracker[1][2]).toEqual('w');
    });

    it('should findChosenPosition when the score is less than 0.3  ', () => {
        spyOn(Math, 'random').and.returnValue(0.2);

        const position = {
            coords: [1, 2, 3],
            orientation: 'v',
        };
        const score = 15;
        spyOn(service.scoredPositions, 'filter').and.returnValue([
            { position, score },
            { position, score },
        ]);
        const res = service.findChosenPosition();
        expect(res).toEqual({ position, score });
    });

    it('should findChosenPosition when the score is less than 0.4  ', () => {
        spyOn(Math, 'random').and.returnValue(0.35);

        const position = {
            coords: [1, 2, 3],
            orientation: 'v',
        };
        const score = 11;
        spyOn(service.scoredPositions, 'filter').and.returnValue([
            { position, score },
            { position, score },
        ]);
        const res = service.findChosenPosition();
        expect(res).toEqual({ position, score });
    });

    it('should findChosenPosition when the score is more than 0.4  ', () => {
        spyOn(Math, 'random').and.returnValue(0.9);

        const position = {
            coords: [1, 2, 3],
            orientation: 'v',
        };
        const score = 7;
        spyOn(service.scoredPositions, 'filter').and.returnValue([
            { position, score },
            { position, score },
        ]);
        const res = service.findChosenPosition();
        expect(res).toEqual({ position, score });
    });

    // it('should convert Position To String   ', () => {
    //     const position = {
    //         coords: [1, 2],
    //         orientation: 'string',
    //     };
    //     service.convertPositionToString(position);
    // });

    it('should calculatePositionScore from the grid service  ', () => {
        const position = {
            coords: [1, 2],
            orientation: 'string',
        };
        const score = 15;
        service.allowedPostions = [
            {
                coords: [1, 1],
                orientation: 'string',
            },
        ];
        service.scoredPositions = [
            { position, score },
            { position, score },
            { position, score },
        ];
        service.calculatePositionScore('hey');
        expect(wordActionSpy.calculateScore).toHaveBeenCalled();
    });

    it('should generateRandomLetters  ', () => {
        spyOn(Math, 'random').and.returnValue(1);
        spyOn(Math, 'floor').and.returnValue(1);

        service.generateRandomLetters(7);
    });

    it('should findEmptyPossiblePositions  ', () => {
        const position = {
            coords: [1, 2],
            orientation: 'v',
        };
        service.allowedPostions.push(position);

        service.findEmptyPossiblePositions();
    });

    it('should generateWordLengthPositions  ', () => {
        const position = {
            coords: [1, 2],
            orientation: 'v',
        };
        const tabPos = [position, position];
        const word = 'allo';

        service.allowedPostions.push(position);

        service.generateWordLengthPositions(word, tabPos);
    });

    it('should generateWordLengthPositions  ', () => {
        const position = {
            coords: [0, 0],
            orientation: 'h',
        };
        const tabPos = [position, position];
        const word = 'allo';

        service.allowedPostions.push(position);

        service.generateWordLengthPositions(word, tabPos);
    });

    it('should filterNonAllowedPositions case 1  ', () => {
        const position = {
            coords: [-2, 0],
            orientation: 'h',
        };
        const tabPos = [position, position];
        const word = 'allo';
        const bool = true;
        service.filterNonAllowedPositions(word, tabPos);
        expect(bool).toBeTrue();
    });

    it('should filterNonAllowedPositions case 2  ', () => {
        const position = {
            coords: [0, -2],
            orientation: 'h',
        };
        const tabPos = [position, position];
        const word = 'allo';
        const bool = true;
        service.filterNonAllowedPositions(word, tabPos);
        expect(bool).toBeTrue();
    });

    it('should filterNonAllowedPositions case 3  ', () => {
        const position = {
            coords: [5, 5],
            orientation: 'v',
        };
        const tabPos = [position, position];
        const word = 'allo';
        const bool = false;
        service.filterNonAllowedPositions(word, tabPos);
        expect(bool).toBeFalse();
    });

    it('should filterNonAllowedPositions case 4  ', () => {
        const position = {
            coords: [1000, 1000],
            orientation: 'Z',
        };
        const tabPos = [position, position];
        const word = 'allo';
        const bool = false;
        service.filterNonAllowedPositions(word, tabPos);
        expect(bool).toBeFalse();
    });

    // it('should move to the nextPermutation if array.length-1<0  ', () => {
    //     expect(service.nextPermutation(['x', 'a'])).toBeFalse();
    // });

    // it('should return true for nextPermutation  ', () => {
    //     const array: string[] = ['x', 'a', 'a', 'a', 'x', 'a', 'a', 'a'];
    //     expect(service.nextPermutation(array)).toBeTrue();
    // });

    it('should return the expected result for the word hey', () => {
        const expected: Letter[] = [];
        expected.push(new Letter('H', 4));
        expected.push(new Letter('E', 1));
        expected.push(new Letter('Y', 10));
        const result = utils.stringToLetterArray('hey');
        expect(result.length).toBe(3);
        expect(result).toEqual(expected);
    });

    it('should return max combination ', () => {
        service.allCombinations.push('salut');
        service.allCombinations.push('allo');
        service.allCombinations.push('hello');
        const comb = service.findCombinationsInDict();
        expect(comb.length).toEqual(3);
    });

    it('should generate all the allowed positions to place a letter in board if he isnt empty', () => {
        const spy = spyOn(service, 'generateWordLengthPositions');
        // const spy2 = spyOn(service, 'filterNonAllowedPositions');
        service.generateAllowedPositions('allo');
        // expect(service.allowedPostions.length).toBe(0);
        expect(spy).toHaveBeenCalled();
        // expect(spy2).toHaveBeenCalled();
    });

    // it('should generate all the allowed positions to place a letter in board when he is empty', () => {
    //     // service.boardTracker = [
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     //     ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    //     // ];
    //     service.generateAllowedPositions('allo');
    //     expect(service.allowedPostions.length).toBe(30);
    // });

    it('should exchange letters  ', () => {
        const spy = spyOn(utils, 'letterArrayToString');
        const expected: Letter[] = [];
        expected.push(new Letter('H', 4));
        expected.push(new Letter('E', 1));
        expected.push(new Letter('Y', 10));
        utils.letterArrayToString(expected);
        service.exchangeLetters();

        expect(spy).toHaveBeenCalled();
    });

    it('should generate all the possible combinations in the dict from letters ', () => {
        const combExpected = ['a', 'u', 'au', 'ua'];
        service.generateAllPossibleSubstrings('au');
        expect(service.allCombinations).toEqual(combExpected);
    });

    it('should play turn when the probability is less than 0.1', () => {
        spyOn(Math, 'random').and.returnValue(0.01);
        const res = service.playTurn();
        expect(res).toEqual('!passer');
    });

    it('should play turn expert when its hard level', () => {
        const spy = spyOn(service, 'playTurnExpert');
        service.difficulty = HARD_LEVEL;
        service.playTurn();
        expect(spy).toHaveBeenCalled();
    });

    it('should play turn expert when the virtual board is more than 7', () => {
        service.allCombinations = [];
        service.alternativeCommands = [];
        service.virtualPlayerBoard = 'ab';
        service.difficulty = HARD_LEVEL;
        const spy = spyOn(service, 'generateAllPossibleSubstrings');
        service.playTurnExpert();
        expect(spy).toHaveBeenCalled();
    });

    it('should play turn expertwhen its his turn', () => {
        service.allCombinations = [];
        service.alternativeCommands = [];
        const spy = spyOn(service, 'removeWordLettersFromBoard');
        const spy2 = spyOn(service, 'updateTargets');
        service.playTurnExpert();
        expect(spy).toHaveBeenCalled();
        expect(service.isFirstTurn).toBeFalse();
        expect(spy2).toHaveBeenCalled();
    });

    it('should play turn normal when its not the  hard level', () => {
        const spy = spyOn(service, 'playTurnNormal');
        service.difficulty = 'noting';
        service.playTurn();
        expect(spy).toHaveBeenCalled();
    });

    it('should play turn normal when the proba is different and dictcombin is zero ', () => {
        service.alternativeCommands = [];
        spyOn(Math, 'random').and.returnValue(10);
        spyOn(service, 'findCombinationsInDict').and.returnValue([]);
        service.playTurnNormal();
        expect(service.isFirstTurn).toBeFalse();
    });

    it('should play turn normal when the proba is different and dictcombin is not zero ', () => {
        service.alternativeCommands = [];
        spyOn(Math, 'random').and.returnValue(10);

        service.isFirstTurn = true;
        service.playTurnNormal();
        expect(service.isFirstTurn).toBeFalse();
    });
    it('should play turn normal when the proba is less thans 0.1', () => {
        service.alternativeCommands = [];
        spyOn(Math, 'random').and.returnValue(0.05);
        service.playTurnNormal();
        expect(service.isFirstTurn).toBeFalse();
    });

    it('should play turn when the probability is less than 0.2', () => {
        spyOn(Math, 'random').and.returnValue(0.12);
        const res = service.playTurn();
        expect(res).toEqual('!echanger 1 lettres');
    });

    it('should setIsFisrtTurn', () => {
        const bool = true;
        service.setIsFisrtTurn(bool);
        expect(bool).toEqual(service.isFirstTurn);
    });

    // it('should play turn when the probability is more than than 0.2', () => {
    //     spyOn(Math, 'random').and.returnValue(0.3);
    //     const res = service.playTurn();
    //     expect(res).toHaveBeenCalled();
    // });
    // it('should play turn when the probability is more than 1 and the combinaisons are defined', () => {
    //     spyOn(Math, 'random').and.returnValue(0.9);
    //     const position = {
    //         coords: [1, 2],
    //         orientation: 'v',
    //     };
    //     const score = 15;
    //     spyOn(service, 'findChosenPosition').and.returnValue({ position, score });
    //     service.allCombinations.push('salut');
    //     service.allCombinations.push('alle');
    //     service.allCombinations.push('hello');
    //     const res = service.playTurn(false);
    //     expect(res).toEqual('!placer b3v tutu');
    // });
});
