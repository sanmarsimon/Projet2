import { Component, HostListener, Inject, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    HARD_LEVEL,
    HARD_LEVEL_MESSAGE,
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    OPPONENT_NAMES,
    REGULAR_LEVEL,
    REGULAR_LEVEL_MESSAGE,
} from '@app/constant';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { PlayerService } from '@app/services/player.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
export interface DialogData {
    nameplayer: string;
    opponentName: string;
}
@Component({
    selector: 'app-info-player',
    templateUrl: './info-player.component.html',
    styleUrls: ['./info-player.component.scss'],
})
export class InfoPlayerComponent {
    @Input() namePlayer: FormControl;
    @Output() opponentName: string;
    hasWhitespace: boolean;
    difficulty: string = REGULAR_LEVEL;
    difficultyMessage: string = REGULAR_LEVEL_MESSAGE;
    diffList = [
        {
            value: HARD_LEVEL,
            show: 'Joueur virtuel expert',
        },
        {
            value: REGULAR_LEVEL,
            show: 'Joueur virtuel normal',
        },
    ];
    constructor(
        public dialogRef: MatDialogRef<GameModeComponent>,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public dialog: MatDialog,
        @Inject(PlayerService) public playerService: PlayerService,
        @Inject(VirtualPlayerService) public virtualPlayerService: VirtualPlayerService,
    ) {
        this.namePlayer = new FormControl('', [
            Validators.required,
            Validators.pattern('[a-zA-Z ]*'),
            Validators.minLength(NAME_MIN_LENGTH),
            Validators.maxLength(NAME_MAX_LENGTH),
        ]);
        this.opponentName = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
        this.namePlayer.registerOnChange(this.usernameHasWhitespace);
        const regexp = new RegExp(' ');
        this.hasWhitespace = regexp.test(this.namePlayer.value);
    }
    @HostListener('window:keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            if (this.namePlayer.valid && !this.namePlayer.hasError('minlength') && !this.namePlayer.hasError('maxlength') && !this.hasWhitespace) {
                this.virtualPlayerService.playerName = this.opponentName;
                this.playerService.playerName = this.namePlayer.value;
                this.router.navigate(['/game']);
            }
        }
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
    onChangeLevel() {
        this.virtualPlayerService.difficulty = this.difficulty;
        if (this.difficulty === REGULAR_LEVEL) {
            this.difficultyMessage = REGULAR_LEVEL_MESSAGE;
        }
        if (this.difficulty === HARD_LEVEL) {
            this.difficultyMessage = HARD_LEVEL_MESSAGE;
        }
    }
}
