import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoPlayerComponent } from '@app/pages/info-player/info-player.component';
import { JoinRoomPanelComponent } from '@app/pages/join-room-panel/join-room-panel.component';
import { MultiplayerConfigPanelComponent } from '@app/pages/multiplayer-config-panel/multiplayer-config-panel.component';

@Component({
    selector: 'app-game-mode',
    templateUrl: './game-mode.component.html',
    styleUrls: ['./game-mode.component.scss'],
})
export class GameModeComponent {
    constructor(public dialog: MatDialog) {}
    openDialog() {
        this.dialog.open(InfoPlayerComponent);
    }

    openMulitplayerDialog() {
        this.dialog.open(MultiplayerConfigPanelComponent);
    }

    openJoinRoomDialog() {
        this.dialog.open(JoinRoomPanelComponent);
    }
}
