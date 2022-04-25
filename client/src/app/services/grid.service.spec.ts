/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { matrixOfLetter } from '@app/constant';
import { GridService } from '@app/services/grid.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 640;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_WIDTH);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_HEIGHT);
    });

    it(' drawWord should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.drawWord('test');
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' drawWord should not call fillText if word is empty', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.drawWord('');
        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });

    it(' drawWord should call fillText as many times as letters in a word', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const word = 'test';
        service.drawWord(word);
        expect(fillTextSpy).toHaveBeenCalledTimes(word.length);
    });

    it(' drawWord should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawWord('test');
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawGrid should call moveTo and lineTo 32 times', () => {
        const expectedCallTimes = 32;
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        service.drawGrid();
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawGrid();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' getWordMatrix()', () => {
        expect(service.getWordMatrix()).toEqual(matrixOfLetter);
    });

    // it(' should calculate the score when the orientation is h', () => {
    //     // service.matrixOfBonusPoints=[][];
    //     const res = service.calculateScore('allo', 1, 2, 'h', 3);
    //     expect(res).toEqual(18);
    // });

    // it(' should calculate the score when the orientation is v', () => {
    //     // service.matrixOfBonusPoints=[][];
    //     const res = service.calculateScore('allo', 1, 2, 'v', 3);
    //     expect(res).toEqual(24);
    // });

    // it(' should add a bonus of 50 to the score when the word.length is 7', () => {
    //     // service.matrixOfBonusPoints=[][];
    //     const word = 'bonjour';
    //     const res = service.calculateScore(word, 1, 2, 'v', 5);
    //     expect(word.length).toEqual(7);
    //     expect(res).toEqual(130);
    // });
});
