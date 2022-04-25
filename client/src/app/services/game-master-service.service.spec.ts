/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameMasterService } from './game-master.service';
import { LettersStockService } from './letters-stock.service';
import { MultiplayerService } from './multiplayer.service';
import { PlayerService } from './player.service';
import { VirtualPlayerService } from './virtual-player.service';

describe('GameMasterServiceService', () => {
    let service: GameMasterService;
    let playerService: jasmine.SpyObj<PlayerService>;
    let virtualPlayerService: jasmine.SpyObj<VirtualPlayerService>;
    let letterStockService: jasmine.SpyObj<LettersStockService>;
    let multiPlayerService: jasmine.SpyObj<MultiplayerService>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;

    // let originalTimeout: number;

    beforeEach(() => {
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['close']);
        playerService = jasmine.createSpyObj('PlayerService', ['addFromStock', 'gainedPoints', 'findValueToLetter', 'isLetterFound']);
        virtualPlayerService = jasmine.createSpyObj('VirtualPlayerService', ['']);
        letterStockService = jasmine.createSpyObj('LettersStockService', ['']);
        multiPlayerService = jasmine.createSpyObj('MultiplayerService', ['skipTurn', 'listen', 'listenSkipTurn']);
        TestBed.configureTestingModule({
            providers: [
                { provide: MultiplayerService, useValue: multiPlayerService },
                { provide: VirtualPlayerService, useValue: virtualPlayerService },
                { provide: PlayerService, useValue: playerService },
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
            imports: [MatDialogModule],
        });
        service = TestBed.inject(GameMasterService);
        // const letter = new Letter('kjah', 5);
        // letters = [letter, letter];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    /// //////////////////////  setRoom /////////////////////////////////////////////
    it('should set room', () => {
        const room = 'room1';
        service.setRoom(room);
        expect(service.room).toEqual(room);
    });
    /// //////////////////////  getRoom /////////////////////////////////////////////
    it('should return a room', () => {
        expect(service.getRoom()).toEqual(service.room);
    });
    /// //////////////////////  hasPlayed /////////////////////////////////////////////
    it('should play', () => {
        const spy = spyOn(service, 'endTurn');
        service.hasPlayed();
        expect(service.counterSkipTurn).toEqual(6);
        expect(spy).toHaveBeenCalled();
    });
    /// //////////////////////  setGameMode /////////////////////////////////////////////
    it('should set the game mode', () => {
        const gameMode = 'gameMode';
        service.setGameMode(gameMode);
        expect(service.gameMode).toEqual(gameMode);
    });
    /// //////////////////////  getGameMode /////////////////////////////////////////////
    it('should get the game mode', () => {
        expect(service.getGameMode()).toEqual(service.gameMode);
    });

    /// //////////////////////  endGameByEmptyReserve /////////////////////////////////////////////
    // it('should end the game if its the player s turn', () => {
    //     playerService.isTurn = true;
    //     service.endGameByEmptyReserve();
    //     virtualPlayerService.letters.forEach((element) => {
    //         playerService.gainedPoints(element.value);
    //     });
    //     expect(playerService.gainedPoints).toHaveBeenCalled();

    //     // expect(service.endGame()).toHaveBeenCalled();
    // });

    // it('should add a score if its not the player s turn', () => {
    //     // const spy = spyOn(virtualPlayerService, 'gainedPoints');
    //     // const letter = {
    //     //     letter: 'test',
    //     //     value: 4,
    //     // };
    //     const letters: Letter[] = [
    //         {
    //             letter: 'test',
    //             value: 4,
    //         },
    //         {
    //             letter: 'hey',
    //             value: 5,
    //         },
    //     ];
    //     letters.push(new Letter('H', 4));

    //     playerService.isTurn = false;
    //     service.endGameByEmptyReserve();
    //     expect(virtualPlayerService.currentScore);
    //     // expect(service.endGame()).toHaveBeenCalled();
    // });

    /// //////////////////////  skipTurn /////////////////////////////////////////////
    it('should skip turn if counter is not 0', () => {
        const spy = spyOn(service, 'endTurn');
        playerService.letters = [];
        service.timeLeft = 60;
        playerService.isTurn = false;
        service.counterSkipTurn = 2;
        service.skipTurn();
        expect(spy).toHaveBeenCalled();
        expect(playerService.letters.length).toEqual(0);
        // expect(service.endGame()).toHaveBeenCalled();
    });

    it('should skip turn if counter is 0', () => {
        service.counterSkipTurn = 1;

        const spy = spyOn(service, 'endGame');

        playerService.isTurn = false;
        virtualPlayerService.isTurn = false;

        clearInterval(service.interval);

        playerService.letters = [];
        virtualPlayerService.letters = [];

        playerService.pointsGained = 10;
        virtualPlayerService.currentScore = 5;

        service.skipTurn();
        expect(spy).toHaveBeenCalled();
        expect(playerService.letters.length).toEqual(0);
        expect(virtualPlayerService.letters.length).toEqual(0);
    });

    /// //////////////////////  endTurn /////////////////////////////////////////////
    it('should endTurn', async () => {
        // const spy = spyOn(service, 'endGameByEmptyReserve');
        service.timeLeft = 0;
        playerService.letters = [];
        virtualPlayerService.letters = [];
        letterStockService.letterStock = [];

        service.endTurn();
        // expect(spy).toHaveBeenCalled();
        expect(virtualPlayerService.letters.length).toEqual(0);
        expect(letterStockService.letterStock.length).toEqual(0);
        expect(playerService.letters.length).toEqual(0);
    });

    // it('should endTurn', async () => {
    //     playerService.isTurn = true;
    //     service.timeLeft = 60;
    //     playerService.letters = [];

    //     service.endTurn();
    //     await new Promise((f) => setTimeout(f, 1000));
    //     expect(playerService.addFromStock).toHaveBeenCalled();
    //     expect(playerService.letters.length).toEqual(0);
    // });

    it('should endTurn', () => {
        playerService.isTurn = false;
        playerService.letters = [];

        service.endTurn();
        expect(playerService.addFromStock).toHaveBeenCalled();
        expect(playerService.letters.length).toEqual(0);
    });

    /// //////////////////////  endGame /////////////////////////////////////////////
    // it('should endGame when the player has letters', () => {
    //     playerService.isTurn = false;
    //     virtualPlayerService.isTurn = false;
    //     clearInterval(service.interval);
    //     playerService.letters = [];

    //     service.endGame();
    //     expect(playerService.gainedPoints).toHaveBeenCalled();
    //     expect(playerService.letters.length).toEqual(0);
    // });

    // it('should endGame when the  player has more score than the virtual one', () => {
    //     playerService.isTurn = false;
    //     service.isEndGame = true;
    //     clearInterval(service.interval);
    //     service.gameMode = SINGLE_PLAYER_MODE;

    //     playerService.pointsGained = 10;
    //     virtualPlayerService.currentScore = 5;

    //     service.endGame();
    //     expect(service.winner).toEqual(playerService.playerName);
    //     expect(virtualPlayerService.isTurn).toBeFalse();
    // });
    // it('should endGame when the  virtual player has more score than the player', () => {
    //     playerService.isTurn = false;
    //     virtualPlayerService.isTurn = false;
    //     clearInterval(service.interval);
    //     service.gameMode = SINGLE_PLAYER_MODE;
    //     const letter = new Letter('kjah', 5);
    //     playerService.letters = [letter, letter];
    //     service.isEndGame = true;
    //     playerService.pointsGained = 5;
    //     virtualPlayerService.currentScore = 10;

    //     service.endGame();
    //     expect(playerService.gainedPoints).toHaveBeenCalled();
    //     // expect(service.winner).toEqual(virtualPlayerService.playerName);
    //     expect(virtualPlayerService.isTurn).toBeFalse();
    // });

    // it('should endGame when the  virtual player has more score than the player', () => {
    //     playerService.isTurn = false;
    //     virtualPlayerService.isTurn = false;
    //     clearInterval(service.interval);

    //     service.isEndGame = true;
    //     service.winner = '';
    //     playerService.pointsGained = 0;
    //     virtualPlayerService.currentScore = 0;
    //     const result = playerService.playerName + ' ' + virtualPlayerService.playerName;
    //     service.endGame();
    //     expect(service.winner).toEqual(result);
    // });

    /// //////////////////////  startTimer /////////////////////////////////////////////
    it('should start timer  when the time left is done', () => {
        clearInterval(service.interval);
        // const spy = spyOn(service, 'skipTurn');
        service.timeLeft = 10;
        service.startTimer();
        let res = (service.interval = {} as ReturnType<typeof setInterval>);
        res = setInterval(() => {
            expect(res).toHaveBeenCalled();
            expect(service.timeLeft).toEqual(service.timeLeft - 1);

            // expect(spy).toHaveBeenCalled();
        }, 1000);
    });

    it('should start timer  when the time left is done', () => {
        clearInterval(service.interval);
        const spy = spyOn(service, 'skipTurn');
        service.timeLeft = -2;
        service.startTimer();
        let res = (service.interval = {} as ReturnType<typeof setInterval>);
        res = setInterval(() => {
            expect(res).toHaveBeenCalled();

            expect(spy).toHaveBeenCalled();
        }, 1000);
    });

    // /// //////////////////////  opponentQuit /////////////////////////////////////////////
    // it('should opponentQuit', () => {
    //     clearInterval(service.interval);
    //     const spy = spyOn(service, 'skipTurn');
    //     service.timeLeft = -5;
    //     service.opponentQuit();

    //     expect(service.endGameOpponentQuit()).toHaveBeenCalled();

    //     expect(spy).toHaveBeenCalled();
    // });
    /// //////////////////////  startGame /////////////////////////////////////////////
    // it('should start the game when its mode solo, when its the virtual player turn', () => {
    //     service.gameMode = 'single_player';
    //     virtualPlayerService.isTurn = true;
    //     spyOn(Math, 'random').and.returnValue(0.2);

    //     const spy = spyOn(virtualPlayerService, 'playTurn');
    //     service.timeLeft = -5;
    //     service.startGame();
    //     expect(spy).toHaveBeenCalled();
    //     expect(virtualPlayerService.isTurn).not.toEqual(playerService.isTurn);
    // });
    // it('should start the game when its mode solo, when its the virtual player turn', () => {
    //     service.gameMode = 'single_player';
    //     virtualPlayerService.isTurn = true;
    //     playerService.isTurn = false;
    //     spyOn(Math, 'random').and.returnValue(0.2);

    //     service.startGame();
    // });

    // it('should start the game when its mode solo, when its the virtual player turn', () => {
    //     service.gameMode = 'single_player';
    //     virtualPlayerService.isTurn = true;
    //     // const spy = spyOn(virtualPlayerService, 'playTurn');
    //     service.startGame();
    //     // expect(spy).not.toHaveBeenCalled();
    // });

    // it('should start the game when its mode MJ ', fakeAsync(async () => {
    //     service.gameMode = 'multi_player';
    //     // const spy = spyOn(service, 'startTimer');
    //     service.room = 'room';
    //     await multiPlayerService.getCreatorName('room');
    //     await multiPlayerService.getOpponentName('room');
    //     playerService.playerName = 'manal';
    //     await service.startGame();
    //     // expect(spy).toHaveBeenCalled();
    //     expect(playerService.isTurn).toBeTrue();
    // }));

    // /// //////////////////////  endGameOpponentQuit /////////////////////////////////////////////
    // it('should opponentQuit', () => {
    //     service.isEndGame = true;
    //     clearInterval(service.interval);
    //     service.endGameOpponentQuit();

    //     expect(service.winner).toEqual(playerService.playerName);
    // });
});
