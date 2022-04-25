/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { VALEURDOUBLEMOT, VALEURTRIPLEMOT } from '@app/constant';
import { GameMasterService } from './game-master.service';
import { MultiplayerService } from './multiplayer.service';
import { PlayerService } from './player.service';
import { WordActionMj } from './word-action-mj.service';

describe('WordAction', () => {
    let service: WordActionMj;
    let playerServiceSpy: jasmine.SpyObj<PlayerService>;
    let multiplayerServiceSpy: jasmine.SpyObj<MultiplayerService>;
    let gameMasterService: jasmine.SpyObj<GameMasterService>;

    beforeEach(() => {
        playerServiceSpy = jasmine.createSpyObj('PlayerService', [
            'areLettersAvailable',
            'findValueToLetter',
            'deleteListBonus',
            'gainedPointsOpponent',
            'gainedPoints',
            'isLetterFound',
        ]);
        multiplayerServiceSpy = jasmine.createSpyObj('MultiplayerService', ['listen']);
        gameMasterService = jasmine.createSpyObj('GameMasterService', ['']);

        TestBed.configureTestingModule({
            providers: [
                { provide: PlayerService, useValue: playerServiceSpy },
                { provide: MultiplayerService, useValue: multiplayerServiceSpy },
                { provide: GameMasterService, useValue: gameMasterService },
            ],
        });
        service = TestBed.inject(WordActionMj);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true', async () => {
        const word = 'oui';
        expect(service.checkWordExistence(word)).toBeTruthy();
    });
    /// /////////////////////////////   deleteListBonus ///////////////////////////////////////
    it('should return delete the bonus list', () => {
        service.deleteListBonus();
        expect(service.listBonusWords).toEqual([]);
    });

    /// /////////////////////////////   calculateScoreVertically ///////////////////////////////////////
    it('should return delete the bonus list', () => {
        const matrixOfBonusPoints = [
            [VALEURTRIPLEMOT, 1, 1, 2, 1, 1, 1, VALEURTRIPLEMOT, 1, 1, 1, 2, 1, 1, VALEURTRIPLEMOT],
            [1, VALEURDOUBLEMOT, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, VALEURDOUBLEMOT, 1],
            [1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1],
            [2, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 2],
            [1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1],
            [1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1],
            [1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1],
            [VALEURTRIPLEMOT, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, VALEURTRIPLEMOT],
            [1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1],
            [1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1],
            [1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1],
            [2, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 2],
            [1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1],
            [1, VALEURDOUBLEMOT, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, VALEURDOUBLEMOT, 1],
            [VALEURTRIPLEMOT, 1, 1, 2, 1, 1, 1, VALEURTRIPLEMOT, 1, 1, 1, 2, 1, 1, VALEURTRIPLEMOT],
        ];
        service.listBonusWords.push(matrixOfBonusPoints[0][2]);
        const word = 'te';
        playerServiceSpy.areLettersAvailable('t');
        service.calculateScoreVertically(word, 5, 2, 10);
        expect(playerServiceSpy.findValueToLetter).not.toHaveBeenCalled();
        expect(matrixOfBonusPoints[0][2]).toEqual(1);
    });

    it('should return delete the bonus list', () => {
        const matrixOfBonusPoints = [
            [VALEURTRIPLEMOT, 1, 1, 2, 1, 1, 1, VALEURTRIPLEMOT, 1, 1, 1, 2, 1, 1, VALEURTRIPLEMOT],
            [1, VALEURDOUBLEMOT, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, VALEURDOUBLEMOT, 1],
            [1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1],
            [2, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 2],
            [1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1],
            [1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1],
            [1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1],
            [VALEURTRIPLEMOT, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, VALEURTRIPLEMOT],
            [1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1],
            [1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1],
            [1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1],
            [2, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 2],
            [1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1],
            [1, VALEURDOUBLEMOT, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, VALEURDOUBLEMOT, 1],
            [VALEURTRIPLEMOT, 1, 1, 2, 1, 1, 1, VALEURTRIPLEMOT, 1, 1, 1, 2, 1, 1, VALEURTRIPLEMOT],
        ];
        service.listBonusWords.push(matrixOfBonusPoints[0][2]);

        const word = 'te';
        const score = 10;
        service.listBonusWords = [2, 3, 4];
        playerServiceSpy.letters = [];
        playerServiceSpy.areLettersAvailable('t');
        const result = service.calculateScoreVertically(word, 5, 2, score);
        expect(result).toBe(0);
    });

    /// /////////////////////////////   calculateScore ///////////////////////////////////////
    it('should call the gainedPoints from playerservice', () => {
        const word = 'te';
        playerServiceSpy.areLettersAvailable('t');
        const spy = spyOn(service, 'deleteListBonus');
        service.calculateScore(word, 5, 2, 'h');
        expect(spy).toHaveBeenCalled();
    });

    it('should increment the score if the word length is 7', () => {
        const word = 'dormant';
        const score = 10;
        playerServiceSpy.areLettersAvailable('t');
        service.calculateScore(word, 5, 2, 'h');
        expect(score).toEqual(10);
    });

    it('should call other functions when the direction is vertical', () => {
        const word = 'dormant';
        const score = 10;
        const spy = spyOn(service, 'calculateScoreVertically');
        const spy2 = spyOn(service, 'deleteListBonus');

        service.calculateScore(word, 5, 2, 'v');
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

        expect(score).toEqual(10);
    });

    it('should call gainedPoint when its the player turn', () => {
        const word = 'dormant';
        playerServiceSpy.isTurn = true;

        service.calculateScore(word, 5, 2, 'v');
        expect(playerServiceSpy.gainedPoints).toHaveBeenCalled();
    });

    it('should add the bonus to the score', () => {
        const word = 'dormant';
        const score = 10;

        const hey = (service.listBonusWords = [1, 2, 3]);

        service.calculateScore(word, 5, 2, 'h');
        expect(score).toEqual(score * hey[0]);
    });

    /// /////////////////////////////   placeWordMatrix ///////////////////////////////////////
    it('should place word when the direction is vertical ', () => {
        const word = 'te';
        const spy = spyOn(service, 'calculateScore');
        service.placeWordMatrix(word, 5, 2, 'v');
        expect(spy).toHaveBeenCalled();
    });

    it('should place word when the direction is horizontal ', () => {
        const word = 'te';
        const spy = spyOn(service, 'calculateScore');
        service.placeWordMatrix(word, 5, 2, 'h');
        expect(spy).toHaveBeenCalled();
    });
});
