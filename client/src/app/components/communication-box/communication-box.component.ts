import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { MAX_CHARACTER_MESSAGE, MULTI_PLAYER_MODE, SET_INTERVAL, SINGLE_PLAYER_MODE, TIMER_INTERVAL } from '@app/constant';
import { CommandService } from '@app/services/command-service';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import commandList from '@assets/commandList.json';
@Component({
    selector: 'app-communication-box',
    templateUrl: './communication-box.component.html',
    styleUrls: ['./communication-box.component.scss'],
})
export class CommunicationBoxComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('scrollbox', { static: false }) scrollbox: ElementRef;
    command: string = '';
    commandtmp: string[];
    virtualPlayerName: string = '';
    currentPlayerName: string = 'You\n';
    isFirstTurn = true;
    compteurDebug = 1;
    tempLettre: Letter[];
    gameMode: string;
    room: string;
    waitingForCmd: boolean = false;
    constructor(
        private virtualPlayerSerivce: VirtualPlayerService,
        private playerService: PlayerService,
        @Inject(CommandService) public commandService: CommandService,
        @Inject(GameMasterService) private gameMasterService: GameMasterService,
        @Inject(MultiplayerService) private multiplayerService: MultiplayerService,
    ) {}
    @HostListener('window:beforeunload', ['$event'])
    async beforeUnloadHandler($event: Event) {
        $event.preventDefault();
        alert('La salle va être supprimée!');
        await this.multiplayerService.deleteRoom(this.room);
        return false;
    }
    @HostListener('window:beforeunload')
    async ngOnDestroy(): Promise<void> {
        await this.multiplayerService.deleteRoom(this.room);
    }
    ngAfterViewInit() {
        setInterval(() => {
            this.scrollbox.nativeElement.scroll({
                top: this.scrollbox.nativeElement.scrollHeight,
                left: 0,
                behavior: 'smooth',
            });
        }, SET_INTERVAL);
    }
    async ngOnInit() {
        this.gameMasterService.startTimer();
        this.tempLettre = this.playerService.letters;
        this.gameMode = this.gameMasterService.getGameMode();
        if (this.gameMode === SINGLE_PLAYER_MODE) {
            this.virtualPlayerName = this.virtualPlayerSerivce.getVirtualPlayerName();
            this.virtualPlayerSerivce.initVirtualPlayerBoard();
            if (!this.playerService.isTurn) {
                this.virtualPlayerSerivce.setIsFisrtTurn(true);
                this.commandService.verifyDebugCall(true, this.compteurDebug);
            }
        } else {
            this.currentPlayerName = this.playerService.playerName;
            this.room = this.gameMasterService.getRoom();
        }

        setInterval(() => {
            if (this.gameMasterService.playerTurnOver) {
                this.gameMasterService.playerTurnOver = false;
                if (this.gameMasterService.gameMode === SINGLE_PLAYER_MODE) {
                    this.commandService.verifyDebugCall(true);
                }
            }
        }, TIMER_INTERVAL);

        this.handleOpponentCommand();
        this.showIncommingMessages();
    }
    setCurrentPlayerName(playerName: string) {
        this.currentPlayerName = playerName;
    }
    handleOpponentCommand() {
        this.multiplayerService.listenTunnel('broadcastCommand').subscribe(async (command) => {
            if (command === '!passer') {
                this.commandService.listeCommand.push({ type: 'joueur', value: this.playerService.opponentName, show: true });
                this.commandService.listeCommand.push({ type: 'joueur', value: '!passer', show: true });
            }
            if (!this.playerService.isTurn) {
                this.waitingForCmd = true;
                this.commandService.waitingForCmd = true;
                this.command = command;
                this.gameMasterService.startTimer();
                await this.initCommand();
            }
        });
    }

    async messageType() {
        if (this.command.length > MAX_CHARACTER_MESSAGE) {
            this.commandService.listeCommand.push({ type: 'systeme', value: 'Vous avez dépassé la limite de caractères', show: true });
            return;
        }
        if (this.command[0] === '!' && this.command !== '!aide') {
            await this.initCommand();
        } else if (this.command === '!aide') {
            this.helpCommand();
        } else {
            this.commandService.listeCommand.push({ type: 'joueur', value: this.playerService.playerName, show: true });
            this.commandService.listeCommand.push({ type: 'joueur', value: this.command, show: true });
            this.multiplayerService.sendMessage(this.gameMasterService.room, this.playerService.playerName, this.command);
        }
        this.command = '';
    }

    async showIncommingMessages() {
        this.multiplayerService.listenMessage('sendMessage').subscribe((message) => {
            this.commandService.listeCommand.push({ type: 'jv', value: message.name, show: true });
            this.commandService.listeCommand.push({ type: 'jv', value: message.message, show: true });
        });
    }

    helpCommand() {
        commandList.commands.forEach((element) => {
            this.commandService.listeCommand.push({ type: 'systeme', value: element.key, show: true });
            this.commandService.listeCommand.push({ type: 'systeme', value: element.value, show: true });
        });
    }

    async initCommand() {
        const sizeMax = 512;
        if (this.gameMasterService.gameMode === SINGLE_PLAYER_MODE) this.gameMasterService.startTimer();
        if (this.command.length > sizeMax) {
            this.commandService.listeCommand.push({ type: 'systeme', value: 'Vous avez dépassé la limite de caractères', show: true });
        } else if (this.gameMasterService.gameMode === SINGLE_PLAYER_MODE && this.virtualPlayerSerivce.isTurn && this.command === '!debug') {
            this.compteurDebug++;
            this.commandService.debugCount = this.compteurDebug;
            this.commandService.listeCommand.push({ type: 'joueur', value: this.command, show: true });
            if (this.gameMasterService.gameMode === SINGLE_PLAYER_MODE) this.commandService.verifyDebugCall(true, this.compteurDebug);
        } else if (this.command === '!passer' && this.playerService.isTurn) {
            this.commandService.listeCommand.push({ type: 'joueur', value: this.currentPlayerName, show: true });
            this.commandService.listeCommand.push({ type: 'joueur', value: this.command, show: true });
            this.gameMasterService.skipTurn();
            if (this.gameMasterService.gameMode === MULTI_PLAYER_MODE) {
                this.multiplayerService.broadcastCommand(this.room, this.command);
                this.multiplayerService.broadcastLetterLength(this.room, this.playerService.letters.length);
            }
        } else if (this.command !== '!debug') {
            if (this.playerService.isTurn) {
                this.setCurrentPlayerName(this.playerService.playerName);
                this.commandService.listeCommand.push({ type: 'joueur', value: this.currentPlayerName, show: true });
                this.commandService.listeCommand.push({ type: 'joueur', value: this.command, show: true });
                await this.commandService.commandSwitch(this.command);
                if (this.gameMasterService.gameMode === SINGLE_PLAYER_MODE) this.commandService.verifyDebugCall(true, this.compteurDebug);
            } else if (this.gameMasterService.gameMode === MULTI_PLAYER_MODE) {
                this.executeOpponentCommand(this.command);
                this.waitingForCmd = false;
            } else {
                this.commandService.listeCommand.push({ type: 'systeme', value: 'Veuillez attendre votre tour', show: true });
            }
        } else if (this.command === '!debug') {
            this.compteurDebug++;
            this.commandService.debugCount = this.compteurDebug;
            this.commandService.listeCommand.push({ type: 'joueur', value: this.currentPlayerName, show: true });
            this.commandService.listeCommand.push({ type: 'joueur', value: this.command, show: true });
        } else {
            this.commandService.listeCommand.push({ type: 'joueur', value: this.currentPlayerName, show: true });
            this.commandService.listeCommand.push({ type: 'joueur', value: this.command, show: true });
        }
        this.command = '';
    }
    executeOpponentCommand(command: string) {
        this.waitingForCmd = !this.playerService.isTurn;
        this.commandService.command = command;
        if (this.waitingForCmd && command.length > 0) {
            if (command.split(' ')[0] === '!échanger' && command.split(' ').length > 1) {
                this.commandService.listeCommand.push({ type: 'joueur', value: this.playerService.opponentName, show: true });
                this.commandService.listeCommand.push({
                    type: 'joueur',
                    value: '!échanger '.concat(command.split(' ')[1].length.toString(), ' lettres'),
                    show: true,
                });
                this.gameMasterService.hasPlayed();
            } else if (command.split(' ')[0] === '!placer') {
                this.commandService.listeCommand.push({ type: 'joueur', value: this.playerService.opponentName, show: true });
                this.commandService.listeCommand.push({ type: 'joueur', value: command, show: true });
                this.commandService.commandSwitch(command);
            } else {
                if (command.split(' ')[0] === 'FailedPlace') {
                    this.commandService.listeCommand.push({ type: 'systeme', value: 'Placement adversaire non valide', show: true });
                }
                this.gameMasterService.hasPlayed();
            }
        } else if (this.waitingForCmd && command.length === 0) {
            this.commandService.listeCommand.push({ type: 'systeme', value: 'Commande de adversaire non recu', show: true });
            this.gameMasterService.hasPlayed();
        }
        this.waitingForCmd = false;
    }
}
