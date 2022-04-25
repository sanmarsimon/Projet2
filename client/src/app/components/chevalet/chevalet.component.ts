import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { SINGLE_PLAYER_MODE } from '@app/constant';
import { MouseButton } from '@app/enums/key-board';
import { ChevaletService } from '@app/services/chevalet.service';
import { CommandService } from '@app/services/command-service';
import { GameMasterService } from '@app/services/game-master.service';
import { LettersStockService } from '@app/services/letters-stock.service';
import { PlayerService } from '@app/services/player.service';
@Component({
    selector: 'app-chevalet',
    templateUrl: './chevalet.component.html',
    styleUrls: ['./chevalet.component.scss'],
})
export class ChevaletComponent implements AfterViewInit {
    @ViewChild('chevalet', { static: false }) private chevalet!: ElementRef<HTMLCanvasElement>;

    couleurSelection: string;
    numberOfLettersToSwap: number = 0;
    selectedLetters: boolean[] = [false, false, false, false, false, false, false];
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    lettersInStock: number;

    constructor(
        @Inject(PlayerService) private playerService: PlayerService,
        @Inject(LettersStockService) private letterStock: LettersStockService,
        @Inject(CommandService) private commandService: CommandService,
        @Inject(GameMasterService) private gameMaster: GameMasterService,
        public chevaletService: ChevaletService,
    ) {
        this.lettersInStock = this.letterStock.letterStock.length;
    }

    ngAfterViewInit(): void {
        this.chevalet.nativeElement.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
            this.lettersInStock = this.letterStock.letterStock.length;
        });
        this.chevalet.nativeElement.addEventListener('mouseup', (event: MouseEvent) => {
            event.preventDefault();
        });
    }

    mouseHitDetect(event: MouseEvent, index: number) {
        if (event.button === MouseButton.Left) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
            this.cancelSwapSelection();
            this.chevaletService.onClick(index);
        } else if (event.button === MouseButton.Right) {
            event.preventDefault();
            if (this.playerService.isTurn) {
                this.onRightClick(event, index);
            }
        }
    }

    // When the user click right on a letter we wait for the user to click right again to swap the letters in the chevalet
    onRightClick(event: MouseEvent, index: number) {
        event.preventDefault();
        this.selectLettersToSwap(index);
    }
    get letters() {
        return this.playerService.letters;
    }

    cancelSwapSelection() {
        this.selectedLetters = [false, false, false, false, false, false, false];
        this.numberOfLettersToSwap = 0;
    }

    selectLettersToSwap(index: number) {
        this.selectedLetters[index] = !this.selectedLetters[index];
        this.numberOfLettersToSwap = 0;
        for (const letter of this.selectedLetters) {
            if (letter) {
                this.numberOfLettersToSwap++;
            }
        }
    }

    swapLetters() {
        let letters = '';
        for (let i = 0; i < this.selectedLetters.length; i++) {
            if (this.selectedLetters[i]) {
                letters += this.playerService.letters[i].letter;
            }
        }
        this.playerService.swapLetter(letters);
        const signalToCommBox: string[] = ['!échanger', letters, 'SwapButton'];
        this.commandService.swapCommand(signalToCommBox); // this.gameMaster.hasPlayed() is being called in here
        if (this.gameMaster.gameMode === SINGLE_PLAYER_MODE) this.commandService.verifyDebugCall(true);
        this.cancelSwapSelection();
    }

    onClick(index: number) {
        this.chevaletService.onClick(index);
    }

    colorSelection(index: number) {
        for (let i = 0; i < this.selectedLetters.length; i++) {
            if (this.selectedLetters[i] && i === index) {
                return 'green';
            }
        }
        return this.chevaletService.color(index);
    }
}
