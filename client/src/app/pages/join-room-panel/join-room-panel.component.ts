import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MULTI_PLAYER_MODE, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '@app/constant';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-join-room-panel',
    templateUrl: './join-room-panel.component.html',
    styleUrls: ['./join-room-panel.component.scss'],
})
export class JoinRoomPanelComponent implements OnInit {
    hasWhitespace: boolean;
    roomName: string = '';
    roomList: string[] = [];
    namePlayer: FormControl;
    opponentName: string;
    dictName: string;
    sameNameError: boolean = false;
    showCreatorName: boolean = false;
    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<GameModeComponent>,
        @Inject(MAT_DIALOG_DATA) public dialog: MatDialog,
        @Inject(MultiplayerService) public multiplayerService: MultiplayerService,
        @Inject(PlayerService) public playerService: PlayerService,
        @Inject(GameMasterService) public gameMasterService: GameMasterService,
    ) {
        this.namePlayer = new FormControl('', [
            Validators.required,
            Validators.pattern('[a-zA-Z ]*'),
            Validators.minLength(NAME_MIN_LENGTH),
            Validators.maxLength(NAME_MAX_LENGTH),
        ]);
    }

    async ngOnInit() {
        this.roomList = await this.multiplayerService.getRooms(this.gameMasterService.gameRules);
        if (this.roomList.length === 1 && this.roomList[0] === '') this.roomList = [];
    }

    async startGame() {
        const creatorName = await this.multiplayerService.getCreatorName(this.roomName);
        if (this.namePlayer.value === creatorName) {
            this.sameNameError = true;
        } else {
            this.sameNameError = false;
            this.gameMasterService.setGameMode(MULTI_PLAYER_MODE);
            this.multiplayerService.joinRoom(this.roomName, this.namePlayer.value);
            this.playerService.setOpponentName(this.opponentName);
            this.playerService.setPlayerName(this.namePlayer.value);
            this.gameMasterService.setRoom(this.roomName);
            await this.multiplayerService.deleteRoom(this.roomName);
            await this.router.navigateByUrl('/game');
        }
    }

    async onRoomChoose() {
        if (this.roomName.trim() !== '') {
            this.opponentName = await this.multiplayerService.getCreatorName(this.roomName);
            this.dictName = await this.multiplayerService.getDictName(this.roomName);
            this.showCreatorName = true;
        }
    }

    usernameHasWhitespace() {
        const regexp = new RegExp(' ');
        this.hasWhitespace = regexp.test(this.namePlayer.value);
    }

    onChangeWrapper() {
        this.usernameHasWhitespace();
    }

    onReturnClick() {
        this.router.navigateByUrl('/home');
    }
    randomRoom() {
        do {
            this.roomName = this.roomList[Math.floor(Math.random() * (this.roomList.length + 1))];
            this.onRoomChoose();
        } while (this.opponentName === this.namePlayer.value);
        this.startGame();
    }
}
