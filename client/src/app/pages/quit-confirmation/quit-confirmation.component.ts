import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from '@app/services/multiplayer.service';

@Component({
    selector: 'app-quit-panel',
    templateUrl: './quit-confirmation.component.html',
    styleUrls: ['./quit-confirmation.component.scss'],
})
export class QuitConfirmationComponent {
    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<GameModeComponent>,
        @Inject(MAT_DIALOG_DATA) public dialog: MatDialog,
        @Inject(MultiplayerService) public multiplayerService: MultiplayerService,
        @Inject(GameMasterService) private gameMasterService: GameMasterService,
    ) {}

    quitGame() {
        // send socket quit
        this.multiplayerService.socket.emit('quitGame', this.gameMasterService.room);
        this.multiplayerService.socket.disconnect();
        this.router.navigateByUrl('/home');
    }
}
