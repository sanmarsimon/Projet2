/* eslint-disable @typescript-eslint/no-empty-function */
import { DatabaseService } from '@app/services/database.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';
import { createServer } from 'http';
import * as Sinon from 'sinon';
import * as ioServer from 'socket.io';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { MultiplayerController } from './multiplayer.controller';
describe('MultiplayerController', () => {
    let multiplayerService = new MultiplayerService();
    let wordValidationService = new WordValidationService();
    let multiplayerController: MultiplayerController;
    let dictionaryService: DictionaryService;
    const uri = 'ws://localhost:3000';
    let socket: Socket = io(uri);
    let serverSocket: ioServer.Server;
    let database: DatabaseService;
    const socketMock = {
        emit: () => {},
    } as unknown as ioServer.BroadcastOperator<DefaultEventsMap>;

    beforeEach((done) => {
        multiplayerService = new MultiplayerService();
        wordValidationService = new WordValidationService();
        database = new DatabaseService();
        dictionaryService = new DictionaryService();
        const httpServer = createServer();
        serverSocket = new ioServer.Server(httpServer);
        multiplayerController = new MultiplayerController(multiplayerService, dictionaryService, wordValidationService, serverSocket, database);
        multiplayerController.handleSockets();
        socket = io(uri);
        done();
    });

    after(() => {
        socket.close();
    });

    it('creates room', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: { room: string; creator: string }) => void) => {
                if (eventName === 'createRoom') {
                    callback({ room: 'test', creator: 'manel' });
                }
            },
            join: () => {},
            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('returns room', () => {
        multiplayerService.createRoom('room', 'creator', 'dict', 'gameRule');
        const spySocket = {
            on: (eventName: string, callback: (room: string, opponent: string) => void) => {
                if (eventName === 'getRooms') {
                    callback('room', 'manel');
                }
            },

            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
        expect(multiplayerService.roomList[0]).to.equal('room');
    });
    it('deletes room', () => {
        multiplayerService.createRoom('room', 'creator', 'dict', 'gameRule');
        const spySocket = {
            on: (eventName: string, callback: (room: string) => void) => {
                if (eventName === 'deleteRoom') {
                    callback('room');
                }
            },

            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
        expect(multiplayerService.roomList.indexOf('room')).to.lessThan(0);
    });
    it('returns creator', () => {
        multiplayerService.createRoom('room', 'creator', 'dict', 'gameRule');
        const spySocket = {
            on: (eventName: string, callback: (onMessage: { room: string }) => void) => {
                if (eventName === 'getCreator') {
                    callback({ room: 'room' });
                }
            },

            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
        expect(multiplayerService.getCreatorName('room')).to.equal('creator');
    });
    it('returns opponent', () => {
        multiplayerService.createRoom('room', 'creator', 'dict', 'gameRule');
        multiplayerService.addOpponentName('room', 'opponent');
        const spySocket = {
            on: (eventName: string, callback: (onMessage: { room: string }) => void) => {
                if (eventName === 'getOpponent') {
                    callback({ room: 'room' });
                }
            },

            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
        expect(multiplayerService.getOpponentName('room')).to.equal('opponent');
    });
    it('validates word', () => {
        const spySocket = {
            on: (eventName: string, callback: (word: string) => void) => {
                if (eventName === 'validationWord') {
                    callback('mot');
                }
            },
            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
    });
    it('broadcasts command', () => {
        multiplayerService.createRoom('room', 'creator', 'dict', 'gameRule');
        const spySocket = {
            on: (eventName: string, callback: (onMessage: { room: string; command: string }) => void) => {
                if (eventName === 'broadcastCommand') {
                    callback({ room: 'room', command: '!passer' });
                }
            },
            to: () => {
                return socketMock;
            },
            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return socketMock;
            },
        } as unknown as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
    });
    it('broadcasts letter length', () => {
        multiplayerService.createRoom('room', 'creator', 'dict', 'gameRule');
        const spySocket = {
            on: (eventName: string, callback: (onMessage: { room: string; num: string }) => void) => {
                if (eventName === 'broadcastLetterLength') {
                    callback({ room: 'room', num: '!5' });
                }
            },
            to: () => {
                return socketMock;
            },
            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return socketMock;
            },
        } as unknown as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
    });
    it('sends message', () => {
        multiplayerService.createRoom('room', 'creator', 'dict', 'gameRule');
        const spySocket = {
            on: (eventName: string, callback: (onMessage: { room: string; name: string; message: string }) => void) => {
                if (eventName === 'sendMessage') {
                    callback({ room: 'room', name: 'manel', message: 'test' });
                }
            },
            to: () => {
                return socketMock;
            },

            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return socketMock;
            },
        } as unknown as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
    });
    it('quits game', () => {
        multiplayerService.createRoom('room', 'creator', 'dict', 'gameRule');
        const spySocket = {
            on: (eventName: string, callback: (room: string) => void) => {
                if (eventName === 'quitGame') {
                    callback('room');
                }
            },
            to: () => {
                return socketMock;
            },

            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return socketMock;
            },
        } as unknown as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
    });
    it('skips turn', () => {
        multiplayerService.createRoom('room', 'creator', 'dict', 'gameRule');
        const spySocket = {
            on: (eventName: string, callback: (onMessage: { room: string; name: string }) => void) => {
                if (eventName === 'skipTurn') {
                    callback({ room: 'room', name: 'creator' });
                }
            },
            to: () => {
                return socketMock;
            },

            emit: () => {},
        };
        multiplayerController.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return socketMock;
            },
        } as unknown as ioServer.Server;
        const spy = Sinon.spy(spySocket, 'on');
        multiplayerController.handleSockets();
        expect(spy.called).to.equal(true);
    });
});
