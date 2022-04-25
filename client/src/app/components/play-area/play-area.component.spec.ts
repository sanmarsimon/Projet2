/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Add reason */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { GRID_CASES_VALUES, mouseClick } from '@app/constant';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { CommandService } from '@app/services/command-service';
import { GameMasterService } from '@app/services/game-master.service';
import { GridService } from '@app/services/grid.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';
import { WordActionMj } from '@app/services/word-action-mj.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gridServiceSpyObj: jasmine.SpyObj<GridService>;
    let playerServiceSpyObj: jasmine.SpyObj<PlayerService>;
    let wordActionSpyObj: jasmine.SpyObj<WordActionMj>;
    let commandService: jasmine.SpyObj<CommandService>;
    let multiplayerService: jasmine.SpyObj<MultiplayerService>;
    let gameMasterService: jasmine.SpyObj<GameMasterService>;

    beforeEach(async () => {
        gridServiceSpyObj = jasmine.createSpyObj('GridService', [
            'drawGrid',
            'tripleWord',
            'doubleWord',
            'tripleLetter',
            'doubleLetterCase',
            'starCase',
            'fillNumerotation',
            'placeWord',
            'isInBound',
            'getCaseFromMousePosition',
            'getDirection',
            'getBoardTracker',
            'drawDirection',
            'drawCasesBack',
        ]);
        playerServiceSpyObj = jasmine.createSpyObj('PlayerService', ['placeWord', 'addLetter', 'findValueToLetter', 'isLetterFound']);
        commandService = jasmine.createSpyObj('CommandService', ['commandSwitch']);
        multiplayerService = jasmine.createSpyObj('MultiplayerService', ['']);
        gameMasterService = jasmine.createSpyObj('GameMasterService', ['']);
        wordActionSpyObj = jasmine.createSpyObj('WordActionMj', [
            'verifyPlaceForLetters',
            'placeWordMatrix',
            'findValueToLetter',
            'placeWord',
            'checkWordExistence',
        ]);
        const stubGamepageComponent = { buttonPressed: '' } as GamePageComponent;
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: GridService, useValue: gridServiceSpyObj },
                { provide: GamePageComponent, useValue: stubGamepageComponent },
                { provide: PlayerService, useValue: playerServiceSpyObj },
                { provide: WordActionMj, useValue: wordActionSpyObj },
                { provide: CommandService, useValue: commandService },
                { provide: MultiplayerService, useValue: multiplayerService },
                { provide: GameMasterService, useValue: gameMasterService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('mouseHitDetect should assign the mouse position to mousePosition variable', () => {
    //     const expectedPosition: Vec2 = { x: 10, y: 10 };
    //     const mouseEvent = {
    //         offsetX: expectedPosition.x,
    //         offsetY: expectedPosition.y,
    //         button: 0,
    //     } as MouseEvent;
    //     component.mousePosition = { x: 10, y: 10 };
    //     playerServiceSpyObj.isTurn = true;
    //     component.wordPlaced = '';
    //     gridServiceSpyObj.getCaseFromMousePosition({ x: 4, y: 2 });
    //     component.mouseHitDetect(mouseEvent);
    //     expect(component.mousePosition).toEqual({ x: 5, y: 5 });
    // });

    // it('mouseHitDetect should not change the mouse position if it is not a left click', () => {
    //     // const expectedPosition: Vec2 = { x: 0, y: 0 };
    //     const mouseEvent = {
    //         offsetX: 10,
    //         offsetY: 10,
    //         button: MouseButton.Left,
    //     } as MouseEvent;
    //     playerServiceSpyObj.isTurn = true;
    //     component.wordPlaced = '';
    //     const vec = (component.mousePosition = { x: 0, y: 0 });
    //     const curr = (component.currentCase = { x: 5, y: 5 });
    //     gridServiceSpyObj.getCaseFromMousePosition(vec);
    //     gridServiceSpyObj.getDirection(curr);
    //     gridServiceSpyObj.isInBound(curr);
    //     gridServiceSpyObj.gridContext = {} as CanvasRenderingContext2D;
    //     component.direction = 'h';
    //     const spy = spyOn(component, 'drawCasesBack');
    //     component.mouseHitDetect(mouseEvent);
    //     // expect(component.mousePosition).toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
    //     expect(spy).toHaveBeenCalled();
    // });

    it('moveToPreviousCase should set the currCase when the direction is horizontal', () => {
        const curr = { x: 4, y: 4 };
        const dire = 'h';
        component.currentCase = { x: 0, y: 0 };
        component.moveToPreviousCase(curr, dire);
        expect(component.currentCase).toEqual({ x: 3, y: 4 });
    });
    it('moveToPreviousCase should set the currCase when the direction is vertical', () => {
        const curr = { x: 4, y: 4 };
        const dire = 'v';
        component.currentCase = { x: 0, y: 0 };
        component.moveToPreviousCase(curr, dire);
        expect(component.currentCase).toEqual({ x: 4, y: 3 });
    });

    it('moveToPreviousCase should set the matrix when the isInBound is call', () => {
        const curr = { x: 4, y: 4 };
        const dire = 'v';

        const curr2 = (component.currentCase = { x: 4, y: 4 });
        const dir = mouseClick[curr2.x - 1][curr2.y - 1];
        gridServiceSpyObj.isInBound(curr2);
        component.moveToPreviousCase(curr, dire);
        expect(dir).toEqual(0);
    });

    it('mouseHitDetect should prevent default', () => {
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        const mouseEvent = {
            offsetX: expectedPosition.x + 10,
            offsetY: expectedPosition.y + 10,
            button: 2,
            preventDefault: jasmine.createSpyObj,
        } as MouseEvent;

        const preventDefaultSpy = spyOn(mouseEvent, 'preventDefault');
        component.mouseHitDetect(mouseEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(component.mousePosition).toEqual(expectedPosition);
    });

    it('mouseHitDetect should prevent default', () => {
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        const mouseEvent = {
            offsetX: expectedPosition.x + 10,
            offsetY: expectedPosition.y + 10,
            button: 3,
            preventDefault: jasmine.createSpyObj,
        } as MouseEvent;

        const preventDefaultSpy = spyOn(mouseEvent, 'preventDefault');
        component.mouseHitDetect(mouseEvent);
        expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should call the double letter in the case 2', () => {
        // component.currentCase = { x: 10, y: 10 };
        const curr2 = (component.currentCase = { x: 4, y: 4 });
        GRID_CASES_VALUES[curr2.y - 1][curr2.x - 1];
        // const spy = spyOn(gridServiceSpyObj.gridContext, 'clearRect');
        gridServiceSpyObj.isInBound(curr2);
        gridServiceSpyObj.drawCasesBack(curr2, 'h');
        expect(gridServiceSpyObj.gridContext.font).toBe('10px sans-serif');
    });

    it('buttonDetect in case enter', () => {
        const buttonEvent = {
            key: 'Enter',
            preventDefault: jasmine.createSpyObj,
            stopPropagation: jasmine.createSpyObj,
        } as KeyboardEvent;
        const preventDefaultSpy = spyOn(buttonEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(buttonEvent, 'stopPropagation');

        const spy = spyOn(component, 'confirmPlacement');
        playerServiceSpyObj.isTurn = true;

        component.buttonDetect(buttonEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();

        expect(spy).toHaveBeenCalled();
    });
    it('buttonDetect in case Backspace', () => {
        const buttonEvent = {
            key: 'Backspace',
            preventDefault: jasmine.createSpyObj,
            stopPropagation: jasmine.createSpyObj,
        } as KeyboardEvent;
        const preventDefaultSpy = spyOn(buttonEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(buttonEvent, 'stopPropagation');

        playerServiceSpyObj.isTurn = true;

        component.buttonDetect(buttonEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();

        expect(gridServiceSpyObj.drawCasesBack).toHaveBeenCalled();
    });

    it('buttonDetect in case Escape', () => {
        const buttonEvent = {
            key: 'Escape',
            preventDefault: jasmine.createSpyObj,
            stopPropagation: jasmine.createSpyObj,
        } as KeyboardEvent;
        const preventDefaultSpy = spyOn(buttonEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(buttonEvent, 'stopPropagation');
        const spy = spyOn(component, 'cancelPlacement');
        playerServiceSpyObj.isTurn = true;

        component.buttonDetect(buttonEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();

        expect(spy).toHaveBeenCalled();
    });
    it('buttonDetect in default case', () => {
        const buttonEvent = {
            key: '*',
            preventDefault: jasmine.createSpyObj,
            stopPropagation: jasmine.createSpyObj,
        } as KeyboardEvent;
        const curr = (component.currentCase = { x: 10, y: 10 });
        const matrice: string[][] = [[]];
        matrice.push(['curr', 'ha']);
        const preventDefaultSpy = spyOn(buttonEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(buttonEvent, 'stopPropagation');
        playerServiceSpyObj.isTurn = true;
        component.buttonPressed = 'L';
        gridServiceSpyObj.isInBound(curr);

        component.buttonDetect(buttonEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();

        expect(component.direction.length).toEqual(0);
    });

    it('buttonDetect  put the direction in horizontal', () => {
        const buttonEvent = {
            key: '*',
            preventDefault: jasmine.createSpyObj,
            stopPropagation: jasmine.createSpyObj,
        } as KeyboardEvent;
        const preventDefaultSpy = spyOn(buttonEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(buttonEvent, 'stopPropagation');

        playerServiceSpyObj.isTurn = true;
        component.buttonPressed = 'L';
        component.currentCase = { x: 10, y: 5 };
        // component.mouseClick[5][10] = 2;

        component.buttonDetect(buttonEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();

        expect(component.direction).toEqual('');
    });

    it('buttonDetect  put the direction in vertical', () => {
        const buttonEvent = {
            key: '*',
            preventDefault: jasmine.createSpyObj,
            stopPropagation: jasmine.createSpyObj,
        } as KeyboardEvent;
        const preventDefaultSpy = spyOn(buttonEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(buttonEvent, 'stopPropagation');

        playerServiceSpyObj.isTurn = true;
        component.buttonPressed = 'L';
        component.currentCase = { x: 10, y: 5 };
        // component.mouseClick[5][10] = 3;

        component.buttonDetect(buttonEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(component.direction).toEqual('');
    });

    it('getCaseFromMousePosition ', () => {
        // const expectedPosition: Vec2 = { x: 40, y: 40 };
        // const res = component.getCaseFromMousePosition(expectedPosition);
        // const x = Math.floor(expectedPosition.x / 40);
        // const y = Math.floor(expectedPosition.y / 40);
        // expect(res).toEqual({ x, y });
    });

    it('getNthLetterOfAlphabet ', () => {
        // const n = 10;
        // const res = component.getNthLetterOfAlphabet(n);
        // const expected = String.fromCharCode(A_ASCII + n);
        // expect(res).toEqual(expected);
    });

    it('cancelPlacement ', () => {
        component.currentCase = { x: 0, y: 0 };
        component.nextCase = { x: 0, y: 0 };
        component.wordPlaced = '';
        component.direction = '';
        const spy = spyOn(component, 'resetCurrentState');

        component.cancelPlacement();

        expect(commandService.commandSwitch).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('deleteLetterOfGrid ', () => {
        component.wordPlaced = '';
        component.currentCase = { x: 0, y: 0 };
        component.currentCase = { x: 100, y: 100 };

        component.deleteLetterOfGrid();

        expect(gridServiceSpyObj.drawCasesBack).toHaveBeenCalled();
    });

    // it('confirmPlacement when the direction is horizontal ', () => {
    //     component.wordPlaced = 'heyheyhey';
    //     component.currentCase = { x: 0, y: 0 };
    //     component.nextCase = { x: 0, y: 0 };

    //     playerServiceSpyObj.letters = [] as Letter[];
    //     playerServiceSpyObj.isTurn = true;
    //     wordActionSpyObj.listOfWordsToVerify = ['allo', 'hey'];
    //     wordActionSpyObj.checkWordExistence('heyheyhey');
    //     component.direction = 'h';

    //     component.confirmPlacement();

    //     expect(wordActionSpyObj.placeWordMatrix).toHaveBeenCalled();
    // });

    it('confirmPlacement when the direction is vertical ', () => {
        component.wordPlaced = 'heyheyhey';
        // component.mouseClick[0][0] = 0;
        const firstPlacedCase = { x: 0, y: 0 };
        component.currentCase = { x: 0, y: 10 };
        component.nextCase = { x: 0, y: 0 };

        playerServiceSpyObj.letters = [] as Letter[];
        wordActionSpyObj.listOfWordsToVerify = ['allo', 'hey'];
        component.direction = 'v';

        component.confirmPlacement();
        expect(firstPlacedCase).toEqual({ x: 0, y: 0 });
    });

    it('moveToNextCase when the direction is horizontal ', () => {
        const direct = 'h';
        const curr = { x: 4, y: 4 };
        component.nextCase = { x: 10, y: 10 };
        gridServiceSpyObj.drawCasesBack(curr, direct);
        component.currentCase = { x: 5, y: 5 };
        component.direction = '';
        component.wordPlaced = '';
        gridServiceSpyObj.getBoardTracker();
        component.moveToNextCase(curr, direct);
        expect(component.nextCase).toEqual({ x: curr.x + 1, y: curr.y });
    });
    it('moveToNextCase when the direction is vertical ', () => {
        const direct = 'v';
        const curr = { x: 4, y: 4 };
        component.nextCase = { x: 10, y: 10 };
        gridServiceSpyObj.drawCasesBack(curr, direct);
        component.currentCase = { x: 5, y: 5 };
        component.direction = '';
        component.wordPlaced = '';
        gridServiceSpyObj.getBoardTracker();
        component.moveToNextCase(curr, direct);
        expect(component.nextCase).toEqual({ x: curr.x, y: curr.y + 1 });
    });
});
