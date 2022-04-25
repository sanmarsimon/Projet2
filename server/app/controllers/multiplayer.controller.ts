import { DatabaseService } from '@app/services/database.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { WordValidationService } from '@app/services/word-validation.service';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { DictionaryService } from '@app/services/dictionary.service';
@Service()
export class MultiplayerController {
    sio: io.Server;
    constructor(
        private multiplayerService: MultiplayerService,
        private dictionaryService: DictionaryService,
        private wordValidationService: WordValidationService,
        private pSocket: io.Server,
        private database: DatabaseService,
    ) {
        this.sio = this.pSocket;
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('createRoom', (event: { room: string; creator: string; dictName: string; gameRules: string }) => {
                this.multiplayerService.createRoom(event.room, event.creator, event.dictName, event.gameRules);
                socket.join(event.room);
                socket.emit('setDict', event.dictName);
                // this.multiplayerService.setTargetIndexes(event.room);
                // this.sio.sockets.emit('targets', this.multiplayerService.getRoomTargets(event.room));
            });
            socket.on('joinRoom', (event: { room: string; opponent: string }) => {
                if (this.multiplayerService.checkRoomExistance(event.room)) {
                    this.multiplayerService.addOpponentName(event.room, event.opponent);
                    socket.join(event.room);
                    this.sio.sockets.emit('startGame', event.room);
                    // this.sio.sockets.emit('targets', this.multiplayerService.getRoomTargets(event.room));
                }
            });
            socket.on('getRooms', (event: { gameRules: string }) => {
                const roomList: string = this.multiplayerService.getRoomsList(event.gameRules).join(' ');
                socket.emit('roomsList', roomList);
            });
            socket.on('deleteRoom', (room: string) => {
                if (this.multiplayerService.checkRoomExistance(room)) {
                    this.multiplayerService.deleteRoom(room);
                }
            });
            socket.on('getCreator', (room: string) => {
                const creatorName: string = this.multiplayerService.getCreatorName(room);
                socket.emit('getCreator', creatorName);
            });
            socket.on('getDict', (room: string) => {
                const dictName = this.multiplayerService.getDictName(room);
                socket.emit('getDict', dictName);
            });
            socket.on('getOpponent', (room: string) => {
                const opponentName: string = this.multiplayerService.getOpponentName(room);
                socket.emit('getOpponent', opponentName);
            });
            socket.on('validationWord', (event: { word: string; room: string }) => {
                let dictName = '';
                if (event.room !== undefined) {
                    dictName = this.multiplayerService.getDictName(event.room);
                }
                socket.emit('validationWord', this.wordValidationService.checkWordExistence(event.word, dictName));
            });
            socket.on('broadcastCommand', (event: { room: string; command: string }) => {
                socket.to(event.room).emit('broadcastCommand', event.command);
            });
            socket.on('broadcastLetterLength', (event: { room: string; num: string }) => {
                socket.to(event.room).emit('broadcastLetterLength', event.num);
            });
            socket.on('sendMessage', (event: { room: string; name: string; message: string }) => {
                socket.to(event.room).emit('sendMessage', event);
            });
            socket.on('quitGame', (room: string) => {
                socket.to(room).emit('opponentQuit');
            });
            socket.on('skipTurn', (event: { room: string; name: string }) => {
                socket.to(event.room).emit('skipTurn', event.name); // only send to one
            });
            socket.on('sendScore', (event: { name: string; score: number }) => {
                socket.emit('sendScore', this.database.dataToCompare(event.name, event.score));
            });
            socket.on('showScore', async () => {
                socket.emit('showScore', await this.database.sendTableOfHighScores());
            });
            socket.on('dictExist', (name: string) => {
                socket.emit('dictExist', this.dictionaryService.checkDictExistence(name));
            });
            socket.on('setTargets', (event: { room: string; targetsIds: number[] }) => {
                socket.to(event.room).emit('setTargets', event.targetsIds);
            });
            socket.on('updateTarget', (event: { room: string; playerName: string; targetId: number }) => {
                socket.to(event.room).emit('updateTarget', event); // only send to one
            });
            socket.on('endGame', (room: string) => {
                socket.to(room).emit('endGame');
            });
        });
    }
}
