import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    CLASSIC_RULES,
    LOG2990_RULES,
    MAX_LETTERS,
    MAX_SKIP_TURN,
    MAX_TIMER_COUNT,
    OPPONENT_NAMES,
    RANDOM_BOOLEAN_CONST,
    SINGLE_PLAYER_MODE,
    TIMER_INTERVAL,
    WAIT_1_SEC,
} from '@app/constant';
import { SoloModeNotificationComponent } from '@app/pages/solo-mode-notification/solo-mode-notification.component';
import { LettersStockService } from './letters-stock.service';
import { MultiplayerService } from './multiplayer.service';
import { PlayerService } from './player.service';
import { VirtualPlayerService } from './virtual-player.service';
@Injectable({
    providedIn: 'root',
})
export class GameMasterService {
    gameRules: string = CLASSIC_RULES;
    gameMode: string = SINGLE_PLAYER_MODE;
    interval: ReturnType<typeof setInterval>;
    timeLeft: number;
    counterSkipTurn: number;
    isEndGame: boolean = false;
    winner: string = '';
    room: string;
    playerTurnOver: boolean = false;
    constructor(
        @Inject(PlayerService) private playerService: PlayerService,
        @Inject(VirtualPlayerService) public virtualPlayerService: VirtualPlayerService,
        @Inject(LettersStockService) private letterStockService: LettersStockService,
        @Inject(MultiplayerService) private multiPlayerService: MultiplayerService,
        private dialog: MatDialog,
    ) {}

    async startGame() {
        if (this.gameMode === SINGLE_PLAYER_MODE) {
            if (this.gameRules === LOG2990_RULES) {
                this.playerService.setTargets('');
                this.playerService.assignVirtualPlayerTargets();
            }
            this.playerService.isTurn = Math.random() < RANDOM_BOOLEAN_CONST;
            this.virtualPlayerService.isTurn = !this.playerService.isTurn;
            if (this.virtualPlayerService.isTurn) {
                this.virtualPlayerService.playTurn();
            }
            this.startTimer();
        } else {
            const creator = await this.multiPlayerService.getCreatorName(this.room);
            const opponent = await this.multiPlayerService.getOpponentName(this.room);
            if (this.playerService.playerName === creator) {
                if (this.gameRules === LOG2990_RULES) {
                    this.playerService.setTargets(this.room);
                }
                this.playerService.isTurn = true;
                this.startTimer();
            } else if (this.playerService.playerName === opponent) {
                this.playerService.isTurn = false;
                if (this.gameRules === LOG2990_RULES) {
                    this.setMultiplayerTargets(this.room);
                }
                this.startTimer();
            }
            this.updateOpponentTargets();
            this.opponentQuit();
            this.opponentSkipTurn();
            this.detectEndGame();
        }
        this.counterSkipTurn = MAX_SKIP_TURN;
    }
    setRoom(room: string) {
        this.room = room;
    }
    getRoom() {
        return this.room;
    }
    startTimer() {
        clearInterval(this.interval);
        this.timeLeft = MAX_TIMER_COUNT;
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.skipTurn();
                if (this.gameMode === SINGLE_PLAYER_MODE) {
                    this.playerTurnOver = true;
                }
            }
        }, TIMER_INTERVAL);
    }
    async opponentSkipTurn() {
        this.multiPlayerService.listenSkipTurn('skipTurn').subscribe((data) => {
            if (data.name !== this.playerService.playerName) {
                this.endTurn();
                this.counterSkipTurn--;
            }
        });
    }
    async detectEndGame() {
        this.multiPlayerService.listenTunnel('endGame').subscribe(() => {
            if (!this.isEndGame) {
                this.endGame();
            }
        });
    }
    skipTurn() {
        this.multiPlayerService.skipTurn(this.room, this.playerService.playerName);
        this.counterSkipTurn--;
        if (this.counterSkipTurn === 0) {
            this.endGame();
            return;
        } else {
            if (this.gameMode === SINGLE_PLAYER_MODE) {
                this.playerTurnOver = true;
            }
            this.endTurn();
        }
    }
    async endTurn() {
        if (
            (this.playerService?.letters?.length === 0 || this.virtualPlayerService?.letters?.length === 0) &&
            this.letterStockService.letterStock.length === 0
        ) {
            this.endGameByEmptyReserve();
            return;
        }
        this.timeLeft = MAX_TIMER_COUNT;
        if (this.playerService?.letters?.length < MAX_LETTERS && this.playerService?.isTurn) {
            await new Promise((f) => setTimeout(f, WAIT_1_SEC)); // Attendre 1 sec
            this.playerService.addFromStock(MAX_LETTERS - this.playerService.letters.length);
        }
        this.playerService.isTurn = !this.playerService.isTurn;
        this.virtualPlayerService.isTurn = !this.virtualPlayerService.isTurn;
        if (this.playerService?.letters?.length < MAX_LETTERS && this.playerService?.isTurn) {
            this.playerService.addFromStock(MAX_LETTERS - this.playerService.letters.length);
        }
        if (this.gameMode === SINGLE_PLAYER_MODE && this.virtualPlayerService.isTurn) {
            this.timeLeft = MAX_TIMER_COUNT;
            // make JV play
        }
    }
    hasPlayed() {
        this.counterSkipTurn = MAX_SKIP_TURN;
        this.endTurn();
    }

    endGame() {
        this.isEndGame = true;
        this.playerService.isTurn = false;
        clearInterval(this.interval);
        this.multiPlayerService.sendScore(this.playerService.playerName, this.playerService.pointsGained);
        if (this.gameMode === SINGLE_PLAYER_MODE) {
            this.virtualPlayerService.isTurn = false;
            if (this.playerService.letters.length !== 0) {
                this.playerService.letters.forEach((element) => {
                    this.playerService.gainedPoints(element.value);
                });
            }
            if (this.virtualPlayerService.letters.length !== 0) {
                this.virtualPlayerService.letters.forEach((element) => {
                    this.virtualPlayerService.currentScore += element.value;
                });
            }
            if (this.playerService.pointsGained > this.virtualPlayerService.currentScore) {
                this.winner = this.playerService.playerName;
            } else if (this.virtualPlayerService.currentScore > this.playerService.pointsGained) {
                this.winner = this.virtualPlayerService.playerName;
            } else {
                this.winner = this.playerService.playerName + ' ' + this.virtualPlayerService.playerName;
            }
        } else {
            if (this.isEndGame) {
                this.multiPlayerService.endGame(this.room);
            }
            if (this.playerService.pointsGainedOpponent > this.playerService.pointsGained) {
                this.winner = this.playerService.opponentName;
            } else if (this.playerService.pointsGainedOpponent < this.playerService.pointsGained) {
                this.winner = this.playerService.playerName;
            } else {
                this.winner = this.playerService.playerName + ' et ' + this.playerService.opponentName;
            }
        }
    }
    endGameByEmptyReserve() {
        if (this.playerService.isTurn) {
            this.virtualPlayerService.letters.forEach((element) => {
                this.playerService.gainedPoints(element.value);
            });
        } else {
            this.playerService.letters.forEach((element) => {
                this.virtualPlayerService.currentScore += element.value;
            });
        }
        this.endGame();
    }
    async opponentQuit() {
        this.multiPlayerService.listen('opponentQuit').subscribe(() => {
            this.gameMode = SINGLE_PLAYER_MODE;
            this.virtualPlayerService.setVirtualPlayerName(OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)]);
            this.dialog.open(SoloModeNotificationComponent);
            this.virtualPlayerService.isTurn = !this.playerService.isTurn;
            if (this.virtualPlayerService.isTurn) {
                this.endTurn();
            }
        });
    }
    setGameMode(gameMode: string) {
        this.gameMode = gameMode;
    }
    getGameMode() {
        return this.gameMode;
    }
    async setMultiplayerTargets(room: string) {
        this.multiPlayerService.listenTargets('setTargets').subscribe((targetsIds) => {
            this.playerService.setPublicTargets(room, targetsIds);
        });
    }
    async updateOpponentTargets() {
        this.multiPlayerService.listenTargetCompletion('updateTarget').subscribe((data) => {
            if (data.playerName !== this.playerService.playerName) {
                this.playerService.updateOpponentTargetCompletion(data.targetId);
            }
        });
    }
}
