import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class MultiplayerService {
    socket;
    readonly uri: string = 'ws://localhost:3000';

    constructor() {
        this.socket = io(this.uri);
    }

    listen(eventName: string): Observable<string> {
        return new Observable<string>((subscriber) => {
            this.socket.on(eventName, (data: string) => {
                subscriber.next(data);
                subscriber.complete();
            });
        });
    }

    listenTunnel(eventName: string): Observable<string> {
        return new Observable<string>((subscriber) => {
            this.socket.on(eventName, (data: string) => {
                subscriber.next(data);
            });
        });
    }

    listenMessage(eventName: string): Observable<{ room: string; name: string; message: string }> {
        return new Observable<{ room: string; name: string; message: string }>((subscriber) => {
            this.socket.on(eventName, (data: { room: string; name: string; message: string }) => {
                subscriber.next(data);
            });
        });
    }

    listenSkipTurn(eventName: string): Observable<{ room: string; name: string }> {
        return new Observable<{ room: string; name: string }>((subscriber) => {
            this.socket.on(eventName, (data: { room: string; name: string }) => {
                subscriber.next(data);
            });
        });
    }

    listenTargets(eventName: string): Observable<number[]> {
        return new Observable<number[]>((subscriber) => {
            this.socket.on(eventName, (targetsIds: number[]) => {
                subscriber.next(targetsIds);
            });
        });
    }

    listenTargetCompletion(eventName: string): Observable<{ playerName: string; targetId: number }> {
        return new Observable<{ playerName: string; targetId: number }>((subscriber) => {
            this.socket.on(eventName, (data: { playerName: string; targetId: number }) => {
                subscriber.next(data);
            });
        });
    }
    listenShowScores(eventName: string): Observable<{ name: string; score: number }[]> {
        return new Observable<{ name: string; score: number }[]>((subscriber) => {
            this.socket.on(eventName, (data: { name: string; score: number }[]) => {
                subscriber.next(data);
            });
        });
    }

    async getRooms(gameRules: string): Promise<string[]> {
        this.socket.emit('getRooms', { gameRules });
        return (await this.listen('roomsList').toPromise()).trim().split(' ');
    }

    async createRoom(room: string, creator: string, dictName: string, gameRules: string) {
        this.socket.emit('createRoom', { room, creator, dictName, gameRules });
    }

    joinRoom(room: string, opponent: string) {
        this.socket.emit('joinRoom', { room, opponent });
    }

    async deleteRoom(room: string) {
        return this.socket.emit('deleteRoom', room);
    }

    async getCreatorName(room: string) {
        await this.socket.emit('getCreator', room);
        return await this.listen('getCreator').toPromise();
    }
    async getDictName(room: string) {
        await this.socket.emit('getDict', room);
        return await this.listen('getDict').toPromise();
    }

    async getOpponentName(room: string) {
        await this.socket.emit('getOpponent', room);
        return await this.listen('getOpponent').toPromise();
    }

    broadcastCommand(room: string, command: string) {
        const event = { room, command };
        this.socket.emit('broadcastCommand', event);
    }

    validateWord(word: string, room: string) {
        const event = { word, room };
        this.socket.emit('validationWord', event);
    }

    sendMessage(room: string, name: string, message: string) {
        const event = { room, name, message };
        this.socket.emit('sendMessage', event);
    }
    broadcastLetterLength(room: string, wordLength: number) {
        const num = wordLength.toString();
        this.socket.emit('broadcastLetterLength', { room, num });
    }
    skipTurn(room: string, name: string) {
        const event = { room, name };
        this.socket.emit('skipTurn', event);
    }

    async checkDictExistence(name: string) {
        this.socket.emit('dictExist', name);
        return await this.listen('dictExist').toPromise();
    }
    sendScore(name: string, score: number) {
        const event = { name, score };
        this.socket.emit('sendScore', { event });
    }
    showScore() {
        this.socket.emit('showScore');
    }
    setTargets(room: string, targetsIds: number[]) {
        const event = { room, targetsIds };
        this.socket.emit('setTargets', event);
    }
    updateTargetCompletion(room: string, playerName: string, targetId: number) {
        const event = { room, playerName, targetId };
        this.socket.emit('updateTarget', event);
    }
    endGame(room: string) {
        this.socket.emit('endGame', room);
    }
}
