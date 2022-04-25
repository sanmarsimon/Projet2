import { Inject, Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import {
    ASCI_A,
    ASCI_A_ACCENT_MAX,
    ASCI_A_ACCENT_MIN,
    ASCI_C_ACCENT,
    ASCI_E_ACCENT_MAX,
    ASCI_E_ACCENT_MIN,
    ASCI_O,
    ASCI_U_ACCENT_MAX,
    ASCI_U_ACCENT_MIN,
    ASCI_Z,
    MAX_LENGTH_COMMAND,
    MAX_LENGTH_LINE,
    MAX_LETTERS,
    NAME_MAX_LENGTH,
    SINGLE_PLAYER_MODE,
    TIME_PLAY_FOR_JV,
} from '@app/constant';
import { GameMasterService } from '@app/services/game-master.service';
import { GridService } from '@app/services/grid.service';
import { LettersStockService } from '@app/services/letters-stock.service';
import { MultiplayerService } from './multiplayer.service';
import { PlayerService } from './player.service';
import { VirtualPlayerService } from './virtual-player.service';
import { WordActionMj } from './word-action-mj.service';
@Injectable({
    providedIn: 'root',
})
export class CommandService {
    command: string;
    listeCommand: Command[] = [];
    commandtmp: string[];
    isFirstTurn = true;
    resetTimer = true;
    debugCount = 1;
    waitingForCmd = false;
    constructor(
        private gridService: GridService,
        private virtualPlayerSerivce: VirtualPlayerService,
        private playerService: PlayerService,
        @Inject(LettersStockService) private lettersStockService: LettersStockService,
        @Inject(GameMasterService) private gameMasterService: GameMasterService,
        @Inject(MultiplayerService) private multiplayerService: MultiplayerService,
        @Inject(WordActionMj) private wordActionMjService: WordActionMj,
    ) {}
    // eslint-disable-next-line complexity
    async commandSwitch(command: string): Promise<boolean> {
        this.resetTimer = true;
        this.commandtmp = command.split(' ');
        if (this.commandtmp[0] === 'PlacedFromEvent') {
            let displayPlacedLetters = 'Félicitation vous avez placé : ';
            for (const letter of this.commandtmp[1]) {
                displayPlacedLetters += letter;
            }
            this.listeCommand.push({ type: 'joueur', value: displayPlacedLetters, show: true });
        }
        if (this.commandtmp[0] === '!placer') {
            if (this.commandtmp.length !== 3) {
                this.listeCommand.push({ type: 'systeme', value: 'Veuillez entrer une commande valide!', show: true });
                return false;
            }
            const lenCoords: boolean = this.commandtmp[1].length <= MAX_LENGTH_COMMAND ? true : false;
            const validRow: boolean = ASCI_A <= this.commandtmp[1][0].charCodeAt(0) && this.commandtmp[1][0].charCodeAt(0) <= ASCI_O ? true : false;
            let stillLenCol = false;
            let numCol = -1;
            const numRow = this.commandtmp[1][0].charCodeAt(0) - ASCI_A;
            if (this.commandtmp[1].length === 3) {
                numCol = parseInt(this.commandtmp[1][1], 10);
                stillLenCol = String(numCol).length === 1 ? true : false;
            } else if (this.commandtmp[1].length === MAX_LENGTH_COMMAND) {
                numCol = parseInt(this.commandtmp[1][1] + this.commandtmp[1][2], 10);
                stillLenCol = String(numCol).length === 2 ? true : false;
            }
            const isWordValid: boolean = await this.wordActionMjService.checkWordExistence(this.commandtmp[2].toLowerCase());
            const isEmptyBox: boolean = await this.wordActionMjService.verifyPlaceForLetters(
                this.commandtmp[2].toLowerCase(),
                numRow,
                numCol - 1,
                this.commandtmp[1][this.commandtmp[1].length - 1],
            ); // .value;
            const mustContainsCentralBox = this.verifyContainsCentralBox(
                this.commandtmp[1][0].charCodeAt(0) - ASCI_A,
                numCol,
                this.commandtmp[1][2],
                this.commandtmp[2],
            );
            const validCol: boolean = numCol >= 1 && numCol <= MAX_LENGTH_LINE ? true : false;
            const validDir: boolean =
                this.commandtmp[1][this.commandtmp[1].length - 1] === 'h' || this.commandtmp[1][this.commandtmp[1].length - 1] === 'v' ? true : false;
            const lenMot = this.commandtmp[2].length >= 1 ? true : false;
            let containsOnlyLetters = true;
            let motTmp = '';
            for (const char of this.commandtmp[2]) {
                if (char.toLowerCase().charCodeAt(0) >= ASCI_A && char.toLowerCase().charCodeAt(0) <= ASCI_Z) {
                    motTmp = motTmp.concat(char.toLowerCase());
                } else if (char.toLowerCase().charCodeAt(0) >= ASCI_E_ACCENT_MIN && char.toLowerCase().charCodeAt(0) <= ASCI_E_ACCENT_MAX) {
                    motTmp = motTmp.concat('e');
                } else if (char.toLowerCase().charCodeAt(0) >= ASCI_A_ACCENT_MIN && char.toLowerCase().charCodeAt(0) <= ASCI_A_ACCENT_MAX) {
                    motTmp = motTmp.concat('a');
                } else if (char.toLowerCase().charCodeAt(0) === ASCI_C_ACCENT) {
                    motTmp = motTmp.concat('c');
                } else if (char.toLowerCase().charCodeAt(0) >= ASCI_U_ACCENT_MIN && char.toLowerCase().charCodeAt(0) <= ASCI_U_ACCENT_MAX) {
                    motTmp = motTmp.concat('u');
                } else {
                    containsOnlyLetters = false;
                    break;
                }
            }
            let inGrid = true;
            if (this.commandtmp[1][this.commandtmp[1].length - 1] === 'h') {
                if (numCol + this.commandtmp[2].length > MAX_LENGTH_LINE) {
                    inGrid = false;
                }
            } else if (this.commandtmp[1][this.commandtmp[1].length - 1] === 'v') {
                if (numRow + this.commandtmp[2].length > ASCI_O - ASCI_A + 1) {
                    inGrid = false;
                }
            }
            if (
                isEmptyBox &&
                isWordValid &&
                lenCoords &&
                validRow &&
                stillLenCol &&
                validCol &&
                validDir &&
                lenMot &&
                containsOnlyLetters &&
                inGrid &&
                mustContainsCentralBox
            ) {
                const lettersNeededToPlaceWord = this.gridService.lettersNeededToPlaceWord(
                    this.commandtmp[2].toLowerCase(),
                    numRow,
                    numCol - 1,
                    this.commandtmp[1][this.commandtmp[1].length - 1],
                );
                this.gridService.gridContext.fillStyle = 'rgb(0,0,0)';
                this.gridService.gridContext.font = '28px system-ui';
                if (this.playerService.isTurn && this.playerService.areLettersAvailable(lettersNeededToPlaceWord)) {
                    this.playerService.placeWord(lettersNeededToPlaceWord);
                    this.playerService.updateTargetsCompletion(command);
                    this.gridService.placeWord(motTmp, numRow, numCol - 1, this.commandtmp[1][this.commandtmp[1].length - 1]);
                    this.virtualPlayerSerivce.updateTracker(motTmp, numRow, numCol - 1, this.commandtmp[1][this.commandtmp[1].length - 1]);
                    this.wordActionMjService.placeWordMatrix(motTmp, numRow, numCol - 1, this.commandtmp[1][this.commandtmp[1].length - 1]);
                    this.multiplayerService.broadcastCommand(this.gameMasterService.getRoom(), command);
                    this.multiplayerService.broadcastLetterLength(this.gameMasterService.getRoom(), this.playerService.letters.length);
                } else if (this.playerService.isTurn && !this.playerService.areLettersAvailable(lettersNeededToPlaceWord)) {
                    this.listeCommand.push({ type: 'systeme', value: 'Vous ne possédez pas les lettres nécessaires', show: true });
                    this.multiplayerService.broadcastCommand(this.gameMasterService.getRoom(), 'FailedPlace');
                    this.gameMasterService.hasPlayed();
                    return false;
                } else if (!this.playerService.isTurn) {
                    this.gridService.placeWord(motTmp, numRow, numCol - 1, this.commandtmp[1][this.commandtmp[1].length - 1]);
                    this.virtualPlayerSerivce.updateTracker(motTmp, numRow, numCol - 1, this.commandtmp[1][this.commandtmp[1].length - 1]);
                    this.wordActionMjService.placeWordMatrix(motTmp, numRow, numCol - 1, this.commandtmp[1][this.commandtmp[1].length - 1]);
                    this.lettersStockService.removeFromStock(lettersNeededToPlaceWord.length);
                }
            } else {
                if (this.playerService.isTurn) {
                    this.multiplayerService.broadcastCommand(this.gameMasterService.getRoom(), 'FailedPlace');
                    this.gameMasterService.hasPlayed();
                }
                if (this.virtualPlayerSerivce.isTurn && this.gameMasterService.gameMode === SINGLE_PLAYER_MODE) {
                    this.gameMasterService.hasPlayed();
                }
                if (
                    !(await this.wordActionMjService.verifyPlaceForLetters(
                        this.commandtmp[2].toLowerCase(),
                        numRow,
                        numCol - 1,
                        this.commandtmp[1][this.commandtmp[1].length - 1],
                    ))
                ) {
                    this.listeCommand.push({
                        type: 'systeme',
                        value: "L'emplacement est pas disponible",
                        show: true,
                    });
                    return false;
                }
                if (!lenCoords) {
                    this.listeCommand.push({
                        type: 'systeme',
                        value: 'Les coordonnées {ligne, colonne, orientation} ne doivent pas dépasser 3 ou 4 caractéres',
                        show: true,
                    });
                    return false;
                }
                if (!validRow) {
                    this.listeCommand.push({ type: 'systeme', value: 'La ligne doit etre comprise entre a et o', show: true });
                    return false;
                }
                if (!validCol) {
                    this.listeCommand.push({ type: 'systeme', value: 'La colonne doit etre comprise entre 1 et 15', show: true });
                    return false;
                }
                if (!validDir) {
                    this.listeCommand.push({
                        type: 'systeme',
                        value: 'L orientation doit etre soit h pour horizontale ou v pour vertical',
                        show: true,
                    });
                    return false;
                }
                if (!lenMot) {
                    this.listeCommand.push({ type: 'systeme', value: 'La longueur du mot doit etre composé d au moins 1 lettre', show: true });
                    return false;
                }
                if (!containsOnlyLetters) {
                    this.listeCommand.push({ type: 'systeme', value: 'Le mot doit contenir que des lettres', show: true });
                    return false;
                }
                if (!inGrid) {
                    this.listeCommand.push({ type: 'systeme', value: 'Pas d espace pour placer le mot sur le plateau', show: true });
                    return false;
                }
                if (!isEmptyBox) {
                    this.listeCommand.push({ type: 'systeme', value: 'Une des cases est déja remplie', show: true });
                    return false;
                }
                if (!mustContainsCentralBox) {
                    this.listeCommand.push({ type: 'systeme', value: 'Le premier placement doit contenir la case H8', show: true });
                    return false;
                }
                if (!isWordValid) {
                    this.resetTimer = false;
                    this.listeCommand.push({ type: 'systeme', value: 'Mot invalide', show: true });
                    return false;
                }
            }
        }
        this.swapCommand(this.commandtmp);
        this.virtualPlayerSerivce.isFirstTurn = false;
        return true;
    }
    verifyContainsCentralBox(row: number, column: number, orientation: string, word: string): boolean {
        const boardTrackerCopy: number[][] = [];
        for (let i = 0; i < MAX_LENGTH_LINE; i++) {
            const currLign = [];
            for (let j = 0; j < MAX_LENGTH_LINE; j++) {
                currLign.push(0);
            }
            boardTrackerCopy.push(currLign);
        }
        if (orientation === 'v') {
            for (let i = 0; i < word.length && row + i < NAME_MAX_LENGTH && column - 1 < NAME_MAX_LENGTH; i++) {
                boardTrackerCopy[row + i][column - 1] = 1;
            }
        } else {
            for (let i = 0; i < word.length && column - 1 + i < NAME_MAX_LENGTH && row < NAME_MAX_LENGTH; i++) {
                boardTrackerCopy[row][column - 1 + i] = 1;
            }
        }
        const containsCentralBox = boardTrackerCopy[7][7] === 1;
        if (this.isFirstTurn) {
            if (containsCentralBox) {
                this.isFirstTurn = false;
                return true;
            }
            return false;
        }
        return true;
    }
    swapCommand(command: string[]) {
        if (command[0] === '!échanger') {
            let swapSuccessful = false;
            if (!this.playerService.isTurn) {
                this.listeCommand.push({
                    type: 'systeme',
                    value: "Vous n'êtes pas le joueur qui doit jouer",
                    show: true,
                });
                return;
            }
            if (this.lettersStockService.letterStock.length < MAX_LETTERS) {
                this.listeCommand.push({ type: 'systeme', value: 'Commande indisponible: La réserve contient moins de 7 lettres', show: true });
            } else if (command.length === 2) {
                swapSuccessful = this.playerService.swapLetter(command[1].toUpperCase());
                if (command[1].length > MAX_LETTERS) {
                    this.listeCommand.push({
                        type: 'systeme',
                        value: 'Erreur de syntaxe: Vous ne pouvez pas échanger plus de 7 lettres',
                        show: true,
                    });
                } else if (swapSuccessful) {
                    let displaySwappedLetters = 'Félicitation vous avez échanger : ';
                    for (const letter of command[1]) {
                        displaySwappedLetters += letter.toUpperCase() + ', ';
                    }
                    if (this.playerService.isTurn) this.listeCommand.push({ type: 'joueur', value: displaySwappedLetters, show: true });
                } else {
                    this.listeCommand.push({
                        type: 'systeme',
                        value: 'Les lettres à échanger ne sont pas toutes présente dans votre chevalet',
                        show: true,
                    });
                }
            } else if (command.length === 3) {
                swapSuccessful = true;
                let displaySwappedLetters = 'Félicitation vous avez échanger : ';
                for (const letter of command[1]) {
                    displaySwappedLetters += letter + ', ';
                }
                if (this.playerService.isTurn) this.listeCommand.push({ type: 'joueur', value: displaySwappedLetters, show: true });
            } else {
                this.listeCommand.push({ type: 'systeme', value: 'Erreur de syntaxe: Veuillez préciser les lettres à échanger', show: true });
            }
            if (!swapSuccessful) {
                this.multiplayerService.broadcastCommand(this.gameMasterService.getRoom(), 'FailedSwap');
            }
            this.multiplayerService.broadcastCommand(this.gameMasterService.getRoom(), command.join(' '));
        } else if (command[0] !== '!placer' && command[0] !== 'PlacedFromEvent') {
            this.multiplayerService.broadcastCommand(this.gameMasterService.getRoom(), command.join(' '));
        }
        this.gameMasterService.hasPlayed();
    }
    verifyDebugCall(shouldPlay: boolean, debugCount: number = this.debugCount) {
        this.debugCount = debugCount;
        if (shouldPlay) {
            if (debugCount % 2 === 0) {
                this.listeCommand.push({ type: 'jv', value: this.virtualPlayerSerivce.getVirtualPlayerName(), show: true });
                setTimeout(() => {
                    const virtualPlayerCommand = this.virtualPlayerSerivce.playTurn();
                    this.listeCommand.push({ type: 'jv', value: virtualPlayerCommand, show: true });
                    if (this.virtualPlayerSerivce.alternativeCommands.length > 0) {
                        for (const alternativeCommand of this.virtualPlayerSerivce.alternativeCommands) {
                            this.listeCommand.push({ type: 'systeme', value: alternativeCommand, show: true });
                        }
                    }
                    if (!this.commandSwitch(virtualPlayerCommand)) {
                        this.gameMasterService.hasPlayed();
                    }
                }, TIME_PLAY_FOR_JV);
            } else {
                this.listeCommand.push({ type: 'jv', value: this.virtualPlayerSerivce.getVirtualPlayerName(), show: false });
                setTimeout(() => {
                    const virtualPlayerCommand = this.virtualPlayerSerivce.playTurn();
                    this.listeCommand.push({ type: 'jv', value: virtualPlayerCommand, show: false });
                    if (!this.commandSwitch(virtualPlayerCommand)) {
                        this.gameMasterService.hasPlayed();
                    }
                }, TIME_PLAY_FOR_JV);
            }
        }
    }
}
