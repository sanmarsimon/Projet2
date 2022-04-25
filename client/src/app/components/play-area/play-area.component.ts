import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import {
    A_ASCII,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    matrixOfLetter,
    mouseClick,
    SINGLE_PLAYER_MODE,
    SIZE_X_MATRIX,
    SIZE_Y_MATRIX,
    STEP_BACK,
} from '@app/constant';
import { MouseButton } from '@app/enums/key-board';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { CommandService } from '@app/services/command-service';
import { GameMasterService } from '@app/services/game-master.service';
import { GridService } from '@app/services/grid.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { WordActionMj } from '@app/services/word-action-mj.service';
@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit, OnInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    mousePosition: Vec2 = { x: 0, y: 0 };
    currentCase: Vec2 = { x: 0, y: 0 };
    nextCase: Vec2 = { x: 0, y: 0 };
    wordPlaced = '';
    buttonPressed = '';
    direction: string = '';
    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    constructor(
        private readonly gridService: GridService,
        private playerService: PlayerService,
        private gameMaster: GameMasterService,
        private gamePage: GamePageComponent,
        private commandService: CommandService,
        private wordActionMj: WordActionMj,
        private multiplayerService: MultiplayerService,
        private gameMasterService: GameMasterService,
        private virtualPlayer: VirtualPlayerService,
    ) {}
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.gridService.gridContext.fillStyle = 'rgb(0,0,0)';
        this.gridService.gridContext.font = '28px system-ui';
        if (this.playerService.isTurn) {
            switch (event.key) {
                case 'Backspace': {
                    this.gridService.drawCasesBack(this.currentCase, this.direction);
                    this.moveToPreviousCase(this.currentCase, this.direction);
                    this.deleteLetterOfGrid();
                    this.gridService.drawDirection(this.currentCase, this.direction);
                    break;
                }
                case 'Enter': {
                    this.confirmPlacement();
                    break;
                }
                case 'Escape': {
                    this.cancelPlacement();
                    break;
                }
                default: {
                    this.buttonPressed = event.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    if (this.buttonPressed.toUpperCase() === this.buttonPressed) {
                        // Si c'est une lettre majuscule alors on veut une lettre blanche
                        this.buttonPressed = '*';
                    }
                    if (this.gridService.isInBound(this.currentCase) && mouseClick[this.currentCase.y - 1][this.currentCase.x - 1] !== 0) {
                        this.direction = this.gridService.getDirection(this.currentCase);
                        if (
                            this.playerService.isLetterFound(this.buttonPressed.toUpperCase()) &&
                            matrixOfLetter[this.currentCase.y - 1][this.currentCase.x - 1] === ''
                        ) {
                            if (this.buttonPressed === '*') {
                                this.gridService.placeWord(event.key.toLowerCase(), this.currentCase.y - 1, this.currentCase.x - 1, this.direction);
                                this.wordPlaced += event.key.toLowerCase();
                            } else {
                                this.gridService.placeWord(this.buttonPressed, this.currentCase.y - 1, this.currentCase.x - 1, this.direction);
                                this.wordPlaced += this.buttonPressed;
                            }
                            this.playerService.placeWord(this.buttonPressed.toUpperCase());
                            this.moveToNextCase(this.currentCase, this.direction);
                        } else if (matrixOfLetter[this.currentCase.y - 1][this.currentCase.x - 1] === this.buttonPressed) {
                            this.wordPlaced += this.buttonPressed;
                            this.moveToNextCase(this.currentCase, this.direction);
                        }
                    }
                }
            }
        }
    }
    ngOnInit() {
        this.buttonPressed = this.gamePage.buttonPressed;
    }
    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
        this.gridService.tripleWord();
        this.gridService.doubleWord();
        this.gridService.tripleLetter();
        this.gridService.doubleLetterCase();
        this.gridService.starCase();
        this.gridService.fillNumerotation();
    }
    get width(): number {
        return this.canvasSize.x;
    }
    get height(): number {
        return this.canvasSize.y;
    }
    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left && this.playerService.isTurn && this.wordPlaced.length === 0) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
            const newPos = this.gridService.getCaseFromMousePosition(this.mousePosition);
            if (newPos.x !== this.currentCase.x || newPos.y !== this.currentCase.y) {
                if (this.gridService.isInBound(this.currentCase)) {
                    mouseClick[this.currentCase.y - 1][this.currentCase.x - 1] = 0;
                }
                this.gridService.drawCasesBack(this.currentCase, this.direction);
            }
            this.currentCase = newPos;
            mouseClick[this.currentCase.y - 1][this.currentCase.x - 1] += 1;
            this.direction = this.gridService.getDirection(this.currentCase);
            this.gridService.drawCasesBack(this.currentCase, this.direction);
            this.gridService.drawDirection(this.currentCase, this.direction);
        } else if (event.button === MouseButton.Right) {
            event.preventDefault();
        }
    }
    resetCurrentState() {
        for (let i = 0; i < SIZE_Y_MATRIX; i++) {
            for (let j = 0; j < SIZE_X_MATRIX; j++) {
                mouseClick[i][j] = 0;
            }
        }
        this.wordPlaced = '';
        this.currentCase = { x: 0, y: 0 };
        this.nextCase = { x: 0, y: 0 };
    }
    moveToNextCase(currentCase: Vec2, direction: string) {
        if (direction === 'h') {
            this.nextCase = { x: currentCase.x + 1, y: currentCase.y };
        } else if (direction === 'v') {
            this.nextCase = { x: currentCase.x, y: currentCase.y + 1 };
        }
        mouseClick[this.nextCase.y - 1][this.nextCase.x - 1] = mouseClick[this.currentCase.y - 1][this.currentCase.x - 1];
        this.gridService.drawCasesBack(this.currentCase, this.direction);
        // Re draw the letter in the current case after we erased the direction arrow
        if (matrixOfLetter[this.currentCase.y - 1][this.currentCase.x - 1] === '') {
            this.gridService.gridContext.fillStyle = 'rgb(0,0,0)';
            this.gridService.gridContext.font = '28px system-ui';
            this.gridService.placeWord(this.wordPlaced[this.wordPlaced.length - 1], this.currentCase.y - 1, this.currentCase.x - 1, this.direction);
        }
        this.currentCase = this.nextCase;
        this.gridService.drawDirection(this.currentCase, this.direction);
    }
    moveToPreviousCase(currentCase: Vec2, direction: string) {
        if (this.gridService.isInBound(this.currentCase)) {
            mouseClick[this.currentCase.y - 1][this.currentCase.x - 1] = 0;
        }
        if (direction === 'h') {
            this.currentCase = { x: currentCase.x - 1, y: currentCase.y };
        } else if (direction === 'v') {
            this.currentCase = { x: currentCase.x, y: currentCase.y - 1 };
        }
    }
    async confirmPlacement() {
        let firstPlacedCase = { x: 0, y: 0 };
        if (this.direction === 'h') {
            firstPlacedCase = { x: this.currentCase.x - this.wordPlaced.length, y: this.currentCase.y };
        } else if (this.direction === 'v') {
            firstPlacedCase = { x: this.currentCase.x, y: this.currentCase.y - this.wordPlaced.length };
        }
        const isWordValid: boolean = await this.wordActionMj.checkWordExistence(this.wordPlaced);
        const wordCombinationValid: boolean = await this.wordActionMj.verifyPlaceForLetters(
            this.wordPlaced,
            firstPlacedCase.y - 1,
            firstPlacedCase.x - 1,
            this.direction,
        );
        this.gridService.drawCasesBack(this.currentCase, this.direction);
        if (isWordValid && this.playerService.isTurn && this.wordPlaced.length > 0 && wordCombinationValid) {
            if (this.commandService.verifyContainsCentralBox(firstPlacedCase.y - 1, firstPlacedCase.x - 1, this.direction, this.wordPlaced)) {
                this.playerService.placeWord(this.wordPlaced.toUpperCase());
                const command = '!placer '.concat(
                    String.fromCharCode(A_ASCII + firstPlacedCase.y - 1), // The letter of the row
                    firstPlacedCase.x.toString(),
                    this.direction,
                    ' ',
                    this.wordPlaced,
                );
                this.commandService.command = command;
                this.wordActionMj.placeWordMatrix(this.wordPlaced, firstPlacedCase.y - 1, firstPlacedCase.x - 1, this.direction);
                this.virtualPlayer.updateTracker(this.wordPlaced, firstPlacedCase.y, firstPlacedCase.x, this.direction);
                this.multiplayerService.broadcastCommand(this.gameMasterService.getRoom(), command);
                this.multiplayerService.broadcastLetterLength(this.gameMasterService.getRoom(), this.playerService.letters.length);
                const signalToCommBox = 'PlacedFromEvent '.concat(this.wordPlaced);
                this.playerService.updateTargetsCompletion(command);
                this.resetCurrentState();
                this.commandService.commandSwitch(signalToCommBox); // this.gameMaster.hasPlayed() to end turn is being called in the commandSwitch
                if (this.gameMaster.gameMode === SINGLE_PLAYER_MODE) this.commandService.verifyDebugCall(true);
            } else {
                this.cancelPlacement();
            }
        } else {
            this.cancelPlacement();
        }
    }
    cancelPlacement() {
        this.gridService.drawCasesBack(this.currentCase, this.direction);
        while (this.wordPlaced.length > 0) {
            this.moveToPreviousCase(this.currentCase, this.direction);
            this.deleteLetterOfGrid();
        }
        this.resetCurrentState();
        this.commandService.commandSwitch('CancelPlacement'); // this.gameMaster.hasPlayed() to end turn is being called in the commandSwitch
        if (this.gameMaster.gameMode === SINGLE_PLAYER_MODE) this.commandService.verifyDebugCall(true);
    }
    deleteLetterOfGrid() {
        const lettersToGetBack: Letter[] = [];
        const length = this.wordPlaced.length;
        if (this.gridService.isInBound(this.currentCase)) {
            if (matrixOfLetter[this.currentCase.y - 1][this.currentCase.x - 1] === '' && length >= 1) {
                lettersToGetBack.push(
                    new Letter(
                        this.wordPlaced[length - 1].toUpperCase(),
                        this.playerService.findValueToLetter(this.wordPlaced[length - 1].toUpperCase()),
                    ),
                );
            }
        }
        this.gridService.drawCasesBack(this.currentCase, this.direction);
        this.playerService.addLetter(lettersToGetBack);
        this.wordPlaced = this.wordPlaced.slice(0, STEP_BACK);
    }
}
