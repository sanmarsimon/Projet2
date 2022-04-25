/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
    AXE_FOR_X,
    AXE_X_FOR_WORD_MOT,
    AXE_X_FOR_WORD_X,
    AXE_Y_FOR_MOT,
    AXE_Y_FOR_WORD_MOT,
    AXE_Y_FOR_WORD_X,
    AXE_Y_FOR_X,
    BOX_SIDE,
    BROWN_COLOR,
    CANVAS_SIDE,
    CASE_NUMBER,
    CENTRAL_BOX_X_COORD,
    CENTRAL_BOX_Y_COORD,
    COORD_X_FILLRECT,
    COORD_Y_FILLRECT,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    DOUBLE_WORD_BOX,
    DOUBLE_WORD_CASE,
    FIVE_CASES,
    FOUR,
    FOUR_CASES,
    GRIDSERVICE,
    GRID_CASES_VALUES,
    HEXA,
    H_ARROW,
    INCREMENTATION,
    LAST_CASE,
    matrixOfLetter,
    MAX_LENGTH_LINE,
    MAX_SIDES,
    MAX_WIDTH,
    MOON_PINK_COLOR,
    mouseClick,
    SEVEN_CASES,
    SIZE_X_MATRIX,
    SIZE_Y_MATRIX,
    TARGET_DOUBLE_LETTER,
    VALEURDOUBLEMOT,
    VALEURTRIPLEMOT,
    V_ARROW,
    X_OFFSET_ARROW,
    X_OFFSET_FOR_BONUS,
    Y_OFFSET_FOR_BONUS,
} from '@app/constant';
@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    allCombinations: string[] = [];
    listBonusWords: number[] = [];
    listOfIndex: number[][] = [];
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private boardTracker: number[][] = [];

    constructor() {
        for (let i = 0; i < MAX_LENGTH_LINE; i++) {
            const currLign = [];
            for (let j = 0; j < MAX_LENGTH_LINE; j++) {
                currLign.push(0);
            }
            this.boardTracker.push(currLign);
        }
    }
    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = MOON_PINK_COLOR;
        this.gridContext.lineWidth = 1;
        this.gridContext.fillStyle = BROWN_COLOR;
        this.gridContext.fillRect(COORD_X_FILLRECT, COORD_Y_FILLRECT, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        let numerous = BOX_SIDE;
        for (let i = 0; i < CASE_NUMBER; i++) {
            this.gridContext.moveTo(BOX_SIDE, numerous);
            this.gridContext.lineTo(DEFAULT_HEIGHT, numerous);
            numerous += BOX_SIDE;
        }
        let numero = BOX_SIDE;
        for (let k = 0; k < CASE_NUMBER; k++) {
            this.gridContext.moveTo(numero, BOX_SIDE);
            this.gridContext.lineTo(numero, DEFAULT_WIDTH);
            numero += BOX_SIDE;
        }
        this.gridContext.stroke();
    }
    drawWord(word: string) {
        const startPosition: Vec2 = { x: 175, y: 100 };
        const step = 20;
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }
    drawTripleWordCase(
        axeXForMot: number,
        axeYForMot: number,
        axeXForX: number,
        axeYForX: number,
        from: number,
        to: number,
        inc: number,
        iteration: number,
    ) {
        const caseColor = () => {
            return (this.gridContext.fillStyle = 'rgb(224,126,126)');
        };

        for (let i = 0; i < inc; i++) {
            this.gridContext.fillStyle = caseColor();
            this.gridContext.fillRect(from, to, BOX_SIDE, BOX_SIDE);
            this.gridContext.fillStyle = 'black';
            this.gridContext.fillText('MOT', axeXForMot, axeYForMot);
            this.gridContext.fillText('x 3', axeXForX, axeYForX);
            axeXForMot += iteration;
            axeXForX += iteration;
            from += iteration;
        }
    }
    tripleWord() {
        this.drawTripleWordCase(AXE_X_FOR_WORD_MOT, AXE_Y_FOR_WORD_MOT, AXE_X_FOR_WORD_X, AXE_Y_FOR_WORD_X, BOX_SIDE, BOX_SIDE, 3, SEVEN_CASES);
        this.drawTripleWordCase(
            AXE_X_FOR_WORD_MOT,
            AXE_Y_FOR_MOT,
            AXE_X_FOR_WORD_X,
            AXE_Y_FOR_X,
            BOX_SIDE,
            DEFAULT_HEIGHT - BOX_SIDE,
            3,
            SEVEN_CASES,
        );
        this.drawTripleWordCase(
            AXE_X_FOR_WORD_MOT,
            AXE_Y_FOR_WORD_MOT + SEVEN_CASES,
            AXE_X_FOR_WORD_X,
            AXE_Y_FOR_WORD_X + SEVEN_CASES,
            BOX_SIDE,
            SEVEN_CASES + BOX_SIDE,
            3,
            LAST_CASE,
        );
    }
    drawDoubleWordCases(
        axeXForMot: number,
        axeYForMot: number,
        axeXForX2: number,
        axeYForX2: number,
        iteraion: number,
        inc: number,
        incSign: boolean,
        from: number,
        to?: number,
    ) {
        const caseColor = () => {
            return (this.gridContext.fillStyle = 'rgb(220,166,166)');
        };

        for (let i = 0; i < iteraion; i++) {
            this.gridContext.fillStyle = caseColor();
            if (to) {
                this.gridContext.fillRect(from, to, BOX_SIDE, BOX_SIDE);
            } else {
                this.gridContext.fillRect(from, from, BOX_SIDE, BOX_SIDE);
            }
            this.gridContext.fillStyle = 'black';
            this.gridContext.fillText('MOT', axeXForMot, axeYForMot);
            this.gridContext.fillText('x 2', axeXForX2, axeYForX2);
            axeXForMot += inc;
            axeXForX2 += inc;
            from += inc;
            if (incSign) {
                axeYForMot += inc;
                axeYForX2 += inc;
                if (to) to += inc;
            } else {
                axeYForMot -= inc;
                axeYForX2 -= inc;
                if (to) to -= inc;
            }
        }
    }
    doubleWord() {
        this.drawDoubleWordCases(
            AXE_X_FOR_WORD_MOT + BOX_SIDE,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE,
            AXE_X_FOR_WORD_X + BOX_SIDE,
            AXE_Y_FOR_WORD_X + BOX_SIDE,
            FOUR,
            BOX_SIDE,
            true,
            BOX_SIDE * 2,
        );
        this.drawDoubleWordCases(
            AXE_X_FOR_WORD_MOT + BOX_SIDE * DOUBLE_WORD_CASE,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * DOUBLE_WORD_CASE,
            AXE_X_FOR_WORD_X + BOX_SIDE * DOUBLE_WORD_CASE,
            AXE_Y_FOR_WORD_X + BOX_SIDE * DOUBLE_WORD_CASE,
            FOUR,
            BOX_SIDE,
            true,
            BOX_SIDE * DOUBLE_WORD_BOX,
        );
        this.drawDoubleWordCases(
            AXE_X_FOR_WORD_MOT + BOX_SIDE,
            MAX_SIDES,
            AXE_X_FOR_WORD_X + BOX_SIDE,
            MAX_SIDES + DOUBLE_WORD_CASE,
            FOUR,
            BOX_SIDE,
            false,
            BOX_SIDE * 2,
            DEFAULT_HEIGHT - BOX_SIDE * 2,
        );
        this.drawDoubleWordCases(
            AXE_X_FOR_WORD_MOT + BOX_SIDE * DOUBLE_WORD_CASE,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * FOUR,
            AXE_X_FOR_WORD_X + BOX_SIDE * DOUBLE_WORD_CASE,
            AXE_Y_FOR_WORD_X + BOX_SIDE * FOUR,
            FOUR,
            BOX_SIDE,
            false,
            BOX_SIDE * DOUBLE_WORD_BOX,
            FIVE_CASES,
        );
    }
    drawTripleLetterCase(
        axeXForMot: number,
        axeYForMot: number,
        axeXForX: number,
        axeYForX: number,
        from: number,
        to: number,
        inc: number,
        iteration: number,
    ) {
        const caseColor = () => {
            return (this.gridContext.fillStyle = 'rgb(227,155,83)');
        };
        for (let i = 0; i < inc; i++) {
            this.gridContext.fillStyle = caseColor();
            this.gridContext.fillRect(from, to, BOX_SIDE, BOX_SIDE);
            this.gridContext.fillStyle = 'black';
            this.gridContext.fillText('LETTRE', axeXForMot, axeYForMot);
            this.gridContext.fillText('x 3', axeXForX, axeYForX);
            axeXForMot += iteration;
            axeXForX += iteration;
            from += iteration;
        }
    }
    tripleLetter() {
        this.drawTripleLetterCase(
            BOX_SIDE * CANVAS_SIDE,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE,
            AXE_X_FOR_WORD_X + BOX_SIDE * AXE_FOR_X,
            AXE_Y_FOR_WORD_X + BOX_SIDE,
            BOX_SIDE * CANVAS_SIDE,
            BOX_SIDE * 2,
            2,
            FOUR_CASES,
        );
        this.drawTripleLetterCase(
            BOX_SIDE * 2,
            AXE_Y_FOR_WORD_MOT + FIVE_CASES,
            AXE_X_FOR_WORD_X + BOX_SIDE,
            AXE_Y_FOR_WORD_X + FIVE_CASES,
            BOX_SIDE * 2,
            BOX_SIDE * CANVAS_SIDE,
            2,
            FOUR_CASES,
        );
        this.drawTripleLetterCase(
            BOX_SIDE * DOUBLE_WORD_CASE,
            AXE_Y_FOR_WORD_MOT + FIVE_CASES,
            AXE_X_FOR_WORD_X + BOX_SIDE * GRIDSERVICE,
            AXE_Y_FOR_WORD_X + FIVE_CASES,
            BOX_SIDE * DOUBLE_WORD_CASE,
            BOX_SIDE * CANVAS_SIDE,
            2,
            FOUR_CASES,
        );
        this.drawTripleLetterCase(
            BOX_SIDE * 2,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * GRIDSERVICE,
            AXE_X_FOR_WORD_X + BOX_SIDE,
            AXE_Y_FOR_WORD_X + BOX_SIDE * GRIDSERVICE,
            BOX_SIDE * 2,
            BOX_SIDE * DOUBLE_WORD_CASE,
            2,
            FOUR_CASES,
        );
        this.drawTripleLetterCase(
            BOX_SIDE * DOUBLE_WORD_CASE,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * GRIDSERVICE,
            AXE_X_FOR_WORD_X + BOX_SIDE * GRIDSERVICE,
            AXE_Y_FOR_WORD_X + BOX_SIDE * GRIDSERVICE,
            BOX_SIDE * DOUBLE_WORD_CASE,
            BOX_SIDE * DOUBLE_WORD_CASE,
            2,
            FOUR_CASES,
        );
        this.drawTripleLetterCase(
            BOX_SIDE * CANVAS_SIDE,
            DEFAULT_HEIGHT - AXE_Y_FOR_WORD_MOT,
            AXE_X_FOR_WORD_X + BOX_SIDE * AXE_FOR_X,
            DEFAULT_HEIGHT - AXE_X_FOR_WORD_MOT,
            BOX_SIDE * CANVAS_SIDE,
            DEFAULT_HEIGHT - BOX_SIDE * 2,
            2,
            FOUR_CASES,
        );
    }
    doubleLetter(
        axeXForMot: number,
        axeYForMot: number,
        axeXForX2: number,
        axeYForX2: number,
        from: number,
        to: number,
        inc: number,
        iteration: number,
    ) {
        const caseColor = () => {
            return (this.gridContext.fillStyle = 'rgb(152,236,73)');
        };

        for (let i = 0; i < inc; i++) {
            this.gridContext.fillStyle = caseColor();
            this.gridContext.fillRect(from, to, BOX_SIDE, BOX_SIDE);
            this.gridContext.fillStyle = 'black';
            this.gridContext.fillText('LETTRE', axeXForMot, axeYForMot);
            this.gridContext.fillText('x 2', axeXForX2, axeYForX2);
            axeXForMot += iteration;
            axeXForX2 += iteration;
            from += iteration;
        }
    }
    doubleLetterCase() {
        this.doubleLetter(
            BOX_SIDE * FOUR,
            AXE_Y_FOR_WORD_MOT,
            AXE_X_FOR_WORD_X + BOX_SIDE * 3,
            AXE_Y_FOR_WORD_X,
            BOX_SIDE * FOUR,
            BOX_SIDE,
            2,
            BOX_SIDE * INCREMENTATION,
        );
        this.doubleLetter(
            BOX_SIDE * FOUR,
            AXE_Y_FOR_MOT,
            AXE_X_FOR_WORD_X + BOX_SIDE * 3,
            AXE_Y_FOR_X,
            BOX_SIDE * FOUR,
            TARGET_DOUBLE_LETTER,
            2,
            BOX_SIDE * INCREMENTATION,
        );
        this.doubleLetter(
            BOX_SIDE * FOUR,
            AXE_Y_FOR_WORD_MOT + SEVEN_CASES,
            AXE_X_FOR_WORD_X + BOX_SIDE * 3,
            AXE_Y_FOR_WORD_X + SEVEN_CASES,
            BOX_SIDE * FOUR,
            BOX_SIDE * INCREMENTATION,
            2,
            BOX_SIDE * INCREMENTATION,
        );
        this.doubleLetter(
            BOX_SIDE,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * 3,
            AXE_X_FOR_WORD_X,
            AXE_Y_FOR_WORD_X + BOX_SIDE * 3,
            BOX_SIDE,
            FOUR_CASES,
            3,
            SEVEN_CASES,
        );
        this.doubleLetter(
            BOX_SIDE,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * DOUBLE_WORD_BOX,
            AXE_X_FOR_WORD_X,
            AXE_Y_FOR_WORD_X + BOX_SIDE * DOUBLE_WORD_BOX,
            BOX_SIDE,
            DEFAULT_HEIGHT - FOUR_CASES,
            3,
            SEVEN_CASES,
        );
        this.doubleLetter(
            SEVEN_CASES,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * 2,
            AXE_X_FOR_WORD_X + BOX_SIDE * CANVAS_SIDE,
            AXE_Y_FOR_WORD_X + BOX_SIDE * 2,
            SEVEN_CASES,
            BOX_SIDE * 3,
            2,
            BOX_SIDE * 2,
        );
        this.doubleLetter(
            SEVEN_CASES,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * HEXA,
            AXE_X_FOR_WORD_X + BOX_SIDE * CANVAS_SIDE,
            AXE_Y_FOR_WORD_X + BOX_SIDE * HEXA,
            SEVEN_CASES,
            DEFAULT_HEIGHT - BOX_SIDE * 3,
            2,
            BOX_SIDE * 2,
        );
        this.doubleLetter(
            BOX_SIDE * 3,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * CANVAS_SIDE,
            AXE_X_FOR_WORD_X + BOX_SIDE * 2,
            AXE_Y_FOR_WORD_X + BOX_SIDE * CANVAS_SIDE,
            BOX_SIDE * 3,
            SEVEN_CASES,
            2,
            FOUR_CASES,
        );
        this.doubleLetter(
            BOX_SIDE * 3,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * INCREMENTATION,
            AXE_X_FOR_WORD_X + BOX_SIDE * 2,
            AXE_Y_FOR_WORD_X + BOX_SIDE * INCREMENTATION,
            BOX_SIDE * 3,
            BOX_SIDE * GRIDSERVICE,
            2,
            FOUR_CASES,
        );
        this.doubleLetter(
            BOX_SIDE * GRIDSERVICE,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * CANVAS_SIDE,
            AXE_X_FOR_WORD_X + BOX_SIDE * INCREMENTATION,
            AXE_Y_FOR_WORD_X + BOX_SIDE * CANVAS_SIDE,
            BOX_SIDE * GRIDSERVICE,
            SEVEN_CASES,
            2,
            FOUR_CASES,
        );
        this.doubleLetter(
            BOX_SIDE * GRIDSERVICE,
            AXE_Y_FOR_WORD_MOT + BOX_SIDE * INCREMENTATION,
            AXE_X_FOR_WORD_X + BOX_SIDE * INCREMENTATION,
            AXE_Y_FOR_WORD_X + BOX_SIDE * INCREMENTATION,
            BOX_SIDE * GRIDSERVICE,
            BOX_SIDE * GRIDSERVICE,
            2,
            FOUR_CASES,
        );
    }
    starCase() {
        const caseColor = () => {
            return (this.gridContext.fillStyle = 'rgb(220,166,166)');
        };

        this.gridContext.fillStyle = caseColor();
        this.gridContext.fillRect(BOX_SIDE * INCREMENTATION, BOX_SIDE * INCREMENTATION, BOX_SIDE, BOX_SIDE);
        this.gridContext.fillStyle = 'black';
    }
    fillNumerotation() {
        this.gridContext.font = '28px sans-serif';
        this.gridContext.fillStyle = 'black';

        let axe = 50;
        let axe2 = 405;
        let coor2 = 75;

        for (let m = 1; m <= GRIDSERVICE; m++) {
            this.gridContext.fillText(`${m}`, axe, MAX_WIDTH);
            axe += BOX_SIDE;
        }
        for (let j = DOUBLE_WORD_CASE; j <= CASE_NUMBER; j++) {
            this.gridContext.fillText(`${j}`, Number(`${axe2}`), MAX_WIDTH);
            axe2 += BOX_SIDE;
        }
        let k = 'A'.charCodeAt(0);
        let i = 'A'.charCodeAt(0);
        const loopEnd = 'P'.charCodeAt(0);
        for (i; i < loopEnd; i++) {
            k = i;
            this.gridContext.fillText(String.fromCharCode(k), DOUBLE_WORD_CASE, coor2);
            coor2 += BOX_SIDE;
            k++;
        }
    }
    getBoardTracker() {
        return [...this.boardTracker];
    }
    placeWord(word: string, row: number, col: number, direction: string) {
        let axeCol = 50;
        let axeRow = 75;
        for (let m = 1; m <= col; m++) {
            axeCol += BOX_SIDE;
        }
        for (let m = 1; m <= row; m++) {
            axeRow += BOX_SIDE;
        }
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i].toUpperCase(), axeCol, axeRow);
            if (direction === 'v') {
                this.boardTracker[row + i][col] = 1;
                axeRow += BOX_SIDE;
            }
            if (direction === 'h') {
                this.boardTracker[row][col + i] = 1;
                axeCol += BOX_SIDE;
            }
        }
    }
    lettersNeededToPlaceWord(word: string, row: number, col: number, direction: string): string {
        let returnLetters = '';
        if (direction === 'h') {
            let currentCol = col;
            for (const letter of word) {
                if (matrixOfLetter[row][currentCol] === '') {
                    returnLetters = returnLetters.concat(letter);
                }
                currentCol++;
            }
        } else if (direction === 'v') {
            let currentRow = row;
            for (const letter of word) {
                if (matrixOfLetter[currentRow][col] === '') {
                    returnLetters = returnLetters.concat(letter);
                }
                currentRow++;
            }
        }
        return returnLetters.toUpperCase();
    }

    get width(): number {
        return this.canvasSize.x;
    }
    get height(): number {
        return this.canvasSize.y;
    }
    getWordMatrix() {
        return matrixOfLetter;
    }
    drawDirection(currentCase: Vec2, direction: string) {
        if (this.isInBound(currentCase)) {
            this.gridContext.fillStyle = 'red';
            this.gridContext.font = '17px system-ui';
            if (direction === 'h') {
                this.gridContext.fillText(H_ARROW, currentCase.x * BOX_SIDE + X_OFFSET_ARROW, currentCase.y * BOX_SIDE + X_OFFSET_FOR_BONUS);
            } else {
                this.gridContext.fillText(V_ARROW, currentCase.x * BOX_SIDE + X_OFFSET_ARROW, currentCase.y * BOX_SIDE + X_OFFSET_FOR_BONUS);
            }
        }
    }
    isInBound(currentCase: Vec2): boolean {
        return currentCase.x <= SIZE_X_MATRIX && currentCase.y <= SIZE_Y_MATRIX && currentCase.x >= 1 && currentCase.y >= 1;
    }

    getDirection(currentCase: Vec2): string {
        if (mouseClick[currentCase.y - 1][currentCase.x - 1] % 2 === 0) {
            return 'v';
        } else {
            return 'h';
        }
    }
    getCaseFromMousePosition(mousePosition: Vec2): Vec2 {
        const x = Math.floor(mousePosition.x / BOX_SIDE);
        const y = Math.floor(mousePosition.y / BOX_SIDE);
        return { x, y };
    }
    // Method that clear the current case, and colour it back in its original color
    // It re draw the letter that was in the current case if the letter was there before
    drawCasesBack(currentCase: Vec2, direction: string) {
        if (this.isInBound(currentCase)) {
            this.gridContext.clearRect(
                currentCase.x * BOX_SIDE,
                currentCase.y * BOX_SIDE,
                (DEFAULT_HEIGHT * BOX_SIDE) / DEFAULT_HEIGHT,
                (DEFAULT_HEIGHT * BOX_SIDE) / DEFAULT_HEIGHT,
            );
            this.gridContext.font = '10px system-ui';
            switch (GRID_CASES_VALUES[currentCase.y - 1][currentCase.x - 1]) {
                case 2:
                    this.doubleLetter(
                        currentCase.x * BOX_SIDE,
                        currentCase.y * BOX_SIDE + BOX_SIDE / 2,
                        currentCase.x * BOX_SIDE + X_OFFSET_FOR_BONUS,
                        currentCase.y * BOX_SIDE + Y_OFFSET_FOR_BONUS,
                        currentCase.x * BOX_SIDE,
                        currentCase.y * BOX_SIDE,
                        1,
                        0,
                    );
                    break;
                case 3:
                    this.drawTripleLetterCase(
                        currentCase.x * BOX_SIDE,
                        currentCase.y * BOX_SIDE + BOX_SIDE / 2,
                        currentCase.x * BOX_SIDE + X_OFFSET_FOR_BONUS,
                        currentCase.y * BOX_SIDE + Y_OFFSET_FOR_BONUS,
                        currentCase.x * BOX_SIDE,
                        currentCase.y * BOX_SIDE,
                        1,
                        0,
                    );
                    break;
                case VALEURDOUBLEMOT:
                    this.drawDoubleWordCases(
                        currentCase.x * BOX_SIDE + BOX_SIDE / FOUR,
                        currentCase.y * BOX_SIDE + BOX_SIDE / 2,
                        currentCase.x * BOX_SIDE + X_OFFSET_FOR_BONUS,
                        currentCase.y * BOX_SIDE + Y_OFFSET_FOR_BONUS,
                        1,
                        0,
                        false,
                        currentCase.x * BOX_SIDE,
                        currentCase.y * BOX_SIDE,
                    );
                    break;
                case VALEURTRIPLEMOT:
                    this.drawTripleWordCase(
                        currentCase.x * BOX_SIDE + BOX_SIDE / FOUR,
                        currentCase.y * BOX_SIDE + BOX_SIDE / 2,
                        currentCase.x * BOX_SIDE + X_OFFSET_FOR_BONUS,
                        currentCase.y * BOX_SIDE + Y_OFFSET_FOR_BONUS,
                        currentCase.x * BOX_SIDE,
                        currentCase.y * BOX_SIDE,
                        1,
                        0,
                    );
                    break;
                default:
                    if (currentCase.x === CENTRAL_BOX_X_COORD && currentCase.y === CENTRAL_BOX_Y_COORD) {
                        // This case is the center of the grid, we want to colour it in its original colour
                        this.gridContext.fillStyle = 'rgb(220,166,166)';
                        this.gridContext.fillRect(
                            currentCase.x * BOX_SIDE,
                            currentCase.y * BOX_SIDE,
                            (DEFAULT_HEIGHT * BOX_SIDE) / DEFAULT_HEIGHT,
                            (DEFAULT_HEIGHT * BOX_SIDE) / DEFAULT_HEIGHT,
                        );
                        // If this case is a regular case, and not the center of the grid we just colour the case back in its original colour
                    } else if (GRID_CASES_VALUES[currentCase.y - 1][currentCase.x - 1] === 1) {
                        this.gridContext.fillStyle = BROWN_COLOR;
                        this.gridContext.fillRect(
                            currentCase.x * BOX_SIDE,
                            currentCase.y * BOX_SIDE,
                            (DEFAULT_HEIGHT * BOX_SIDE) / DEFAULT_HEIGHT,
                            (DEFAULT_HEIGHT * BOX_SIDE) / DEFAULT_HEIGHT,
                        );
                    }
                    break;
            }
            this.gridContext.strokeRect(currentCase.x * BOX_SIDE, currentCase.y * BOX_SIDE, BOX_SIDE, BOX_SIDE);
            if (matrixOfLetter[currentCase.y - 1][currentCase.x - 1] !== '') {
                this.gridContext.fillStyle = 'rgb(0,0,0)';
                this.gridContext.font = '28px system-ui';
                this.placeWord(matrixOfLetter[currentCase.y - 1][currentCase.x - 1], currentCase.y - 1, currentCase.x - 1, direction);
            }
        }
    }
}
