import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { ChevaletService } from '@app/services/chevalet.service';
import { GameMasterService } from '@app/services/game-master.service';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    letters: Letter[];
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';

    constructor(
        private dialog: MatDialog,
        private playerService: PlayerService,
        private chevaletService: ChevaletService,
        private gameMasterService: GameMasterService,
    ) {}
    ngOnInit(): void {
        this.dialog.closeAll();
        this.letters = this.playerService.letters;
        this.gameMasterService.startGame();
    }

    onKeyDown(event: KeyboardEvent) {
        this.chevaletService.onKeyDown(event);
    }

    onWheel(event: WheelEvent) {
        this.chevaletService.onWheel(event);
    }
}
