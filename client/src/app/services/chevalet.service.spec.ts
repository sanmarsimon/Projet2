import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { ELEMENT_NOT_FOUNDED } from '@app/constant';
import { PlayerService } from '@app/services/player.service';
// import { MAX_NUMBER_LETTER } from '@app/constant';
import { ChevaletService } from './chevalet.service';

describe('ChevaletService', () => {
    let service: ChevaletService;
    let playerServiceSpyObj: jasmine.SpyObj<PlayerService>;
    let letterA: Letter;
    let letterB: Letter;
    let letterC: Letter;

    beforeEach(() => {
        playerServiceSpyObj = jasmine.createSpyObj('PlayerService', ['placeWord', 'addLetter', 'findValueToLetter', 'isLetterFound']);

        TestBed.configureTestingModule({
            providers: [{ provide: PlayerService, useValue: playerServiceSpyObj }],
        });
        service = TestBed.inject(ChevaletService);
        letterA = new Letter('A', 2);
        letterB = new Letter('B', 3);
        letterC = new Letter('C', 3);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /// //////////////////////  onClick ///////////////////////////////////////////
    it('should select the letter which was clicked', () => {
        service.selectedLetterIndex = 0;
        service.buttonPressed = '';

        playerServiceSpyObj.letters = [
            { letter: '', value: 0 },
            { letter: '', value: 1 },
        ];

        service.onClick(0);
        expect(service.selectedLetterIndex).toEqual(0);
        expect(service.buttonPressed).toEqual(playerServiceSpyObj.letters[0].letter);
    });

    /// //////////////////////  onWheel /////////////////////////////////////////////
    it('should call shiftRight', () => {
        const spy = spyOn(service, 'shiftRight');
        const event = { deltaY: -1 } as WheelEvent;
        service.onWheel(event);
        expect(spy).toHaveBeenCalled();
    });
    it('should call shiftLeft', () => {
        const spy = spyOn(service, 'shiftLeft');
        const event = { deltaY: 1 } as WheelEvent;
        service.onWheel(event);
        expect(spy).toHaveBeenCalled();
    });

    /// //////////////////////  onKeyDown ///////////////////////////////////////////
    it('should update buttonPressed and previous fields', () => {
        const event = { key: 'a' } as KeyboardEvent;
        service.buttonPressed = '';
        service.previousButton = '';
        service.selectedLetterIndex = 0;
        service.occurrenceIndexes = [];
        service.multipleOccurrenceIndex = 0;
        service.mousePosition = { x: 0, y: 0 };
        service.letters = [];
        playerServiceSpyObj.letters = [];
        service.onKeyDown(event);
        expect(service.buttonPressed).toEqual('A');
        expect(service.previousButton).toEqual('A');
    });
    it('should call fincOccurrences and selectLetter callbacks', () => {
        const findOccurrenceSpy = spyOn(service, 'findOccurrences');
        const selectLetterSpy = spyOn(service, 'selectLetter');
        const event = { key: 'c' } as KeyboardEvent;
        service.onKeyDown(event);
        expect(findOccurrenceSpy).toHaveBeenCalled();
        expect(selectLetterSpy).toHaveBeenCalled();
    });
    it('should call handleKeyDown', () => {
        const spy = spyOn(service, 'handleKeydown');
        // const spyOnShiftLeft = spyOn(service, 'shiftLeft');
        // playerService.letters = [letterA, letterB];
        // const event = { key: 'b' } as KeyboardEvent;
        // service.onKeyDown(event);
        const event = { key: 'ArrowLeft' } as KeyboardEvent;
        service.selectedLetterIndex = 1;
        service.onKeyDown(event);
        expect(spy).toHaveBeenCalled();
    });
    it('should call handleKeyDown', () => {
        const event = {
            key: '',
            defaultPrevented: true,
        } as KeyboardEvent;
        service.selectedLetterIndex = 1;
        service.handleKeydown(event);
        expect(service.handleKeydown(event));
    });

    /// //////////////////////  handleKeydown ///////////////////////////////////////
    it('should call shiftLeft', () => {
        // const fakeFunction = () => {};
        const spy = spyOn(service, 'shiftLeft');
        const event = { key: 'ArrowLeft' } as KeyboardEvent;
        service.handleKeydown(event);
        expect(spy).toHaveBeenCalled();
    });
    it('should call shiftRight', () => {
        const event = { key: 'ArrowRight' } as KeyboardEvent;
        const spy = spyOn(service, 'shiftRight');
        service.handleKeydown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should exit if default case', () => {
        const spyLeft = spyOn(service, 'shiftLeft');
        const spyRight = spyOn(service, 'shiftRight');
        const keyBoardEvent = { key: 'C' } as KeyboardEvent;
        service.handleKeydown(keyBoardEvent);
        expect(spyLeft).toHaveBeenCalledTimes(0);
        expect(spyRight).toHaveBeenCalledTimes(0);
    });

    /// ////////////////////////  shiftLeft /////////////////////////////////////////
    it('should call arrayRotate', () => {
        const spy = spyOn(service, 'arrayRotate');
        service.selectedLetterIndex = 0;
        playerServiceSpyObj.letters = [];
        service.shiftLeft();
        expect(spy).toHaveBeenCalled();
        expect(service.selectedLetterIndex).toEqual(playerServiceSpyObj.letters.length - 1);
    });
    it('should shift letter left', () => {
        playerServiceSpyObj.letters = [letterA, letterB, letterC];
        service.selectedLetterIndex = 1;
        service.shiftLeft();
        expect(playerServiceSpyObj.letters[0]).toEqual(letterB);
        expect(playerServiceSpyObj.letters[1]).toEqual(letterA);
    });

    /// ////////////////////////  shiftRight /////////////////////////////////////////
    it('should call arrayRotate', () => {
        const spy = spyOn(service, 'arrayRotate');
        playerServiceSpyObj.letters = [];
        service.selectedLetterIndex = -1;
        service.shiftRight();
        expect(spy).toHaveBeenCalled();
        // expect(service.selectedLetterIndex).toEqual(playerService.letters.length - 1);
    });
    it('should shift letter right', () => {
        playerServiceSpyObj.letters = [letterB, letterA, letterC];
        service.selectedLetterIndex = 1;
        service.shiftRight();
        expect(playerServiceSpyObj.letters[1]).toEqual(letterC);
        expect(playerServiceSpyObj.letters[2]).toEqual(letterA);
    });

    /// ////////////////////////  selectLetter //////////////////////////////////////
    it('should the first occurrence while multiple occurence', () => {
        service.occurrenceIndexes = [0, 2];
        service.selectLetter();
        expect(service.selectedLetterIndex).toEqual(0);
        expect(service.multipleOccurrenceIndex).toEqual(1);
    });
    it('should select the right letter', () => {
        service.occurrenceIndexes = [2];
        service.selectLetter();
        expect(service.selectedLetterIndex).toEqual(2);
    });
    it('should update selectLetterIndex if no match', () => {
        service.occurrenceIndexes = [];
        service.selectLetter();
        expect(service.selectedLetterIndex).toEqual(ELEMENT_NOT_FOUNDED);
    });

    /// ////////////////////////  findOccurrences ///////////////////////////////////
    it('should find the occurrences', () => {
        playerServiceSpyObj.letters = [letterA, letterC, letterA, letterA, letterB];
        service.previousButton = 'T';
        service.findOccurrences('A');
        expect(service.occurrenceIndexes).toEqual([0, 2, 3]);
    });

    /// ////////////////////////  arraRotate ////////////////////////////////////////
    it('should rotate array right', () => {
        const array: string[] = ['A', 'B', 'C', 'D'];
        service.arrayRotate(array, true);
        expect(array).toEqual(['D', 'A', 'B', 'C']);
    });
    it('should rotate array left', () => {
        const array: string[] = ['A', 'B', 'C', 'D'];
        service.arrayRotate(array, false);
        expect(array).toEqual(['B', 'C', 'D', 'A']);
    });

    /// ////////////////////////  color /////////////////////////////////////////////
    it('should color the letter if this one is selected', () => {
        const index = 2;
        service.selectedLetterIndex = index;
        const color = service.color(index);
        expect(color).toEqual('red');
    });
    it('should not color the letter if this one is not selected', () => {
        const index = 2;
        service.selectedLetterIndex = ELEMENT_NOT_FOUNDED;
        const color = service.color(index);
        expect(color).not.toEqual('red');
    });
});
