import { Component, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MULTI_PLAYER_MODE, NAME_MAX_LENGTH, NAME_MIN_LENGTH, OPPONENT_NAMES, SINGLE_PLAYER_MODE } from '@app/constant';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { DictionaryService } from '@app/services/dictionary.service';

@Component({
    selector: 'app-multiplayer-config-panel',
    templateUrl: './multiplayer-config-panel.component.html',
    styleUrls: ['./multiplayer-config-panel.component.scss'],
})
export class MultiplayerConfigPanelComponent implements OnInit, OnDestroy {
    @Input() namePlayer: FormControl;
    @Input() roomName: FormControl;
    @Input() dictionaryControl: FormControl;
    @Output() opponentName: string;
    readonly title: string = 'LOG2990';

    hasWhitespace: boolean;
    isLoading: boolean = false;
    invalidRoom: boolean = false;
    deleteRoomOnDestroy: boolean = true;
    constructor(
        private router: Router,
        private multiplayerService: MultiplayerService,
        public dialogRef: MatDialogRef<GameModeComponent>,
        @Inject(MAT_DIALOG_DATA) public dialog: MatDialog,
        @Inject(PlayerService) public playerService: PlayerService,
        @Inject(GameMasterService) public gameMasterService: GameMasterService,
        @Inject(VirtualPlayerService) public virtualPlayerService: VirtualPlayerService,
        public dictionaryService: DictionaryService,
    ) {
        this.namePlayer = new FormControl('', [
            Validators.required,
            Validators.pattern('[a-zA-Z ]*'),
            Validators.minLength(NAME_MIN_LENGTH),
            Validators.maxLength(NAME_MAX_LENGTH),
        ]);
        this.opponentName = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
        this.roomName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
        this.namePlayer.registerOnChange(this.usernameHasWhitespace);
        const regexp = new RegExp(' ');
        this.hasWhitespace = regexp.test(this.namePlayer.value);
        this.dictionaryControl = new FormControl('', [Validators.required]);
    }

    ngOnInit() {
        this.dictionaryService.getList();
    }
    async ngOnDestroy() {
        if (this.deleteRoomOnDestroy) await this.multiplayerService.deleteRoom(this.roomName.value);
    }
    getErrorMessage() {
        if (this.namePlayer.hasError('required')) {
            return 'Vous devez rentrer un nom valide qui contient que des lettres ';
        }

        return this.namePlayer.hasError('pattern') ? 'Le nom n est pas valide' : '';
    }
    onChangeWrapper() {
        this.selectOpponentName();
        this.usernameHasWhitespace();
    }
    selectOpponentName() {
        if (this.namePlayer.value === this.opponentName) {
            let currentIndex = Math.floor(Math.random() * OPPONENT_NAMES.length);
            while (this.opponentName === this.namePlayer.value) {
                currentIndex = Math.floor(Math.random() * OPPONENT_NAMES.length);
                this.opponentName = OPPONENT_NAMES[currentIndex];
            }
        }
    }
    usernameHasWhitespace() {
        const regexp = new RegExp(' ');
        this.hasWhitespace = regexp.test(this.namePlayer.value);
    }

    async startGame() {
        const gameRules = this.gameMasterService.gameRules;
        const roomList: string[] = await this.multiplayerService.getRooms(gameRules);
        // const dictExist = await this.multiplayerService.checkDictExistence(this.dictionaryControl.value.title);
        const roomNameExists = roomList.indexOf(this.roomName.value) >= 0;
        if (!roomNameExists) {
            this.invalidRoom = false;
            await this.multiplayerService.createRoom(this.roomName.value, this.namePlayer.value, this.dictionaryControl.value.title, gameRules);
            this.isLoading = true;
            this.gameMasterService.setGameMode(MULTI_PLAYER_MODE);
            this.multiplayerService.listenTunnel('startGame').subscribe(async (roomName) => {
                if (roomName.trim() === this.roomName.value.trim()) {
                    this.deleteRoomOnDestroy = false;
                    this.opponentName = await this.multiplayerService.getOpponentName(this.roomName.value.trim());
                    this.playerService.setOpponentName(this.opponentName);
                    this.gameMasterService.setRoom(this.roomName.value);
                    await this.router.navigateByUrl('/game');
                }
            });
        } else {
            this.invalidRoom = true;
        }
    }

    onReturnClick() {
        this.multiplayerService.deleteRoom(this.roomName.value);
        this.router.navigateByUrl('/home');
    }

    onCreateSingleGame() {
        this.multiplayerService.deleteRoom(this.roomName.value);
        this.gameMasterService.setGameMode(SINGLE_PLAYER_MODE);
        if (this.namePlayer.valid && !this.namePlayer.hasError('minlength') && !this.namePlayer.hasError('maxlength') && !this.hasWhitespace) {
            this.virtualPlayerService.playerName = this.opponentName;
            this.playerService.playerName = this.namePlayer.value;
            this.router.navigate(['/game']);
        }
        this.router.navigateByUrl('/game');
    }

    get dictionaries() {
        return this.dictionaryService.dictList;
    }
    onChangeDict() {
        // Whatever you want to do after the change
    }
}
