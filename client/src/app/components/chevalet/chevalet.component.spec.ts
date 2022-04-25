import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
// import { LettersStockService } from '@app/services/letters-stock.service';
import { LETTERSTOCKLENGH } from '@app/constant';
import { MouseButton } from '@app/enums/key-board';
import { ChevaletService } from '@app/services/chevalet.service';
import { CommandService } from '@app/services/command-service';
import { GameMasterService } from '@app/services/game-master.service';
import { PlayerService } from '@app/services/player.service';
import { ChevaletComponent } from './chevalet.component';

describe('ChevaletComponent', () => {
    let component: ChevaletComponent;
    let fixture: ComponentFixture<ChevaletComponent>;
    let chevaletServiceSpyObj: jasmine.SpyObj<ChevaletService>;
    let playerServiceSpyObj: jasmine.SpyObj<PlayerService>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;
    let gameMasterServiceSpyObj: jasmine.SpyObj<GameMasterService>;
    // let letterStockSpyObj: jasmine.SpyObj<LettersStockService>;
    // let chevalet: jasmine.SpyObj<any>;
    let letterA: Letter;
    let letterB: Letter;
    let letterC: Letter;
    let index: number;

    beforeEach(async () => {
        chevaletServiceSpyObj = jasmine.createSpyObj('ChevaletService', ['onClick', 'color']);
        playerServiceSpyObj = jasmine.createSpyObj('PlayerService', ['swapLetter', 'addFromStock']);
        commandServiceSpyObj = jasmine.createSpyObj('CommandService', ['swapCommand']);
        gameMasterServiceSpyObj = jasmine.createSpyObj('GameMasterService', ['hasPlayed']);
        // letterStockSpyObj = jasmine.createSpyObj('LettersStockService', ['swapLetters']);
        // chevalet = jasmine.createSpyObj('chevalet', ['addEventListener']);
        letterA = new Letter('A', 2);
        letterB = new Letter('B', 3);
        letterC = new Letter('C', 3);
        index = 2;
        await TestBed.configureTestingModule({
            declarations: [ChevaletComponent],
            providers: [
                { provide: ChevaletService, useValue: chevaletServiceSpyObj },
                { provide: PlayerService, useValue: playerServiceSpyObj },
                { provide: CommandService, useValue: commandServiceSpyObj },
                { provide: GameMasterService, useValue: gameMasterServiceSpyObj },
                // { provide: LettersStockService, useValue: letterStockSpyObj },
                // { provide: chevalet, useValue: chevalet },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChevaletComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update mousePosition field', () => {
        const position: Vec2 = { x: 50, y: 10 };
        const mouseEvent = {
            offsetX: position.x,
            offsetY: position.y,
            button: 0,
        } as MouseEvent;
        component.mouseHitDetect(mouseEvent, index);
        expect(component.mousePosition).toEqual(position);
    });

    it('should call cancelSwapSelection from component and onClick from chevaletService', () => {
        const mouseEvent = { button: MouseButton.Left } as MouseEvent;
        const spy = spyOn(component, 'cancelSwapSelection');
        component.mouseHitDetect(mouseEvent, index);
        expect(spy).toHaveBeenCalled();
        expect(chevaletServiceSpyObj.onClick).toHaveBeenCalled();
    });

    it('should call onRightClick', () => {
        const mouseEvent = {
            button: MouseButton.Right,
            preventDefault: jasmine.createSpyObj,
        } as MouseEvent;
        const spy = spyOn(component, 'onRightClick');
        const preventDefaultSpy = spyOn(mouseEvent, 'preventDefault');
        playerServiceSpyObj.isTurn = true;
        component.mouseHitDetect(mouseEvent, index);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should call selectLettersToSwap', () => {
        const mouseEvent = {
            button: MouseButton.Right,
            preventDefault: jasmine.createSpyObj,
        } as MouseEvent;
        const spy = spyOn(component, 'selectLettersToSwap');
        const preventDefaultSpy = spyOn(mouseEvent, 'preventDefault');
        component.onRightClick(mouseEvent, index);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should update selectLetter array', () => {
        component.selectLettersToSwap(index);
        expect(component.selectedLetters[index]).toEqual(true);
        expect(component.numberOfLettersToSwap).toEqual(1);
    });

    it('should call onClick', () => {
        component.onClick(index);
        expect(chevaletServiceSpyObj.onClick).toHaveBeenCalled();
    });

    it('should call swapLetter with a string from selected letters', () => {
        playerServiceSpyObj.letters = [letterC, letterA, letterB, letterA];
        component.selectedLetters = [true, false, true, true];
        component.swapLetters();
        expect(playerServiceSpyObj.swapLetter).toHaveBeenCalledWith('CBA');
    });

    it('should call swapCommand, swapCommand and hasPlayed', () => {
        const spy = spyOn(component, 'cancelSwapSelection');
        component.swapLetters();
        expect(commandServiceSpyObj.swapCommand).toHaveBeenCalled();
        expect(playerServiceSpyObj.swapLetter).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should return green', () => {
        component.selectedLetters = [true, false, true, true];
        const res = component.colorSelection(index);
        expect(res).toEqual('green');
    });

    it('should call color from chevaletService', () => {
        component.selectedLetters = [true, false, false, false];
        component.colorSelection(index);
        expect(chevaletServiceSpyObj.color).toHaveBeenCalled();
    });

    it('should update lettersInStock field', () => {
        // const mouseEvent = { type: 'mousedown', preventDefault: jasmine.createSpyObj } as MouseEvent;
        // const preventDefaultSpy = spyOn(mouseEvent, 'preventDefault');
        // const len = letterStockSpyObj.letterStock.length;
        component.ngAfterViewInit();
        expect(component.lettersInStock).toEqual(LETTERSTOCKLENGH);
    });

    // it('should add an eventListener', () => {
    //     expect(chevalet.addEventListener).toHaveBeenCalled();
    // });
});
