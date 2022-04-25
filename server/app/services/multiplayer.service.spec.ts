/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable prettier/prettier */
import { RoomsDetails } from '@app/interfaces/rooms-details';
import { expect } from 'chai';
import { MultiplayerService } from './multiplayer.service';

describe('MultiplayerService', () => {
    let multiplayerService: MultiplayerService;

    beforeEach(async () => {
        multiplayerService = new MultiplayerService();
        multiplayerService.roomList = [];
    });
    /// ///////////////////////////// createRoom /////////////////////////////
    it('should push the room in the roomList', (done: Mocha.Done) => {
        const newRoom = 'room';
        const creator = 'manal';
        const gameRules = 'log2990';
        const dict = 'all';
        multiplayerService.roomListLog = [];
        multiplayerService.createRoom(newRoom, creator, dict, gameRules);
        expect(multiplayerService.roomListLog[0]).to.equals(newRoom);
        done();
    });

    /// ///////////////////////////// addOpponentName /////////////////////////////
    it('should add the opponent name', (done: Mocha.Done) => {
        const room = 'room';
        const opponent = 'aldric';
        const roomsDetails: RoomsDetails[] = [{
            roomName: 'room',
            players: {
                creator: 'ali',
                opponent: 'aldric',
            },
            targets: 'string',
            dictionaryName: 'string',
        }];
        multiplayerService.roomsDetails.push(roomsDetails[0]);
        multiplayerService.addOpponentName(room, opponent);
        expect(roomsDetails[0].players.opponent).to.equals(opponent);
        done();
    });

    it('should not add the opponent name if its not the same room', (done: Mocha.Done) => {
        const room = 'room';
        const opponent = 'manal';
        const roomsDetails: RoomsDetails[] = [{
            roomName: 'principalRoom',
            players: {
                creator: 'ali',
                opponent: 'aldric',
            },
            targets: 'string',
            dictionaryName: 'string',
        }];
        multiplayerService.roomsDetails.push(roomsDetails[0]);
        expect(multiplayerService.addOpponentName(room, opponent)).to.equals('');
        done();
    });

    /// ///////////////////////////// getOpponentName /////////////////////////////
    it('should get the opponent name', (done: Mocha.Done) => {
        // const roomsDetails: RoomsDetails = {
        //     roomName: 'room',
        //     players: {
        //         creator: 'ali',
        //         opponent: 'manal',
        //     }
        // };
        // const roomsDetailsTab: RoomsDetails[] = [
        //     {
        //         roomName: 'room',
        //         players: {
        //             creator: 'ali',
        //             opponent: 'manal',
        //         }
        //     },
        //     {
        //         roomName: 'room',
        //         players: {
        //             creator: 'ali',
        //             opponent: 'manal',
        //         }
        //     }];
        // for (const hey of roomsDetailsTab)
        // roomsDetails.roomName = newRoom;
        const room = 'room';
        const roomsDetails: RoomsDetails[] = [{
            roomName: 'principalRoom',
            players: {
                creator: 'ali',
                opponent: 'aldric',
            },
            targets: 'string',
            dictionaryName: 'string',
        }];
        multiplayerService.roomsDetails.push(roomsDetails[0]);
        expect(multiplayerService.getOpponentName(room)).to.equals('');
        done();
    });

    it('should not get the opponent name if its not the same room', (done: Mocha.Done) => {
        const room = 'room';
        const roomsDetails: RoomsDetails[] = [{
            roomName: 'room',
            players: {
                creator: 'ali',
                opponent: 'aldric',
            },
            targets: 'string',
            dictionaryName: 'string',
        }];
        multiplayerService.roomsDetails.push(roomsDetails[0]);
        expect(multiplayerService.getOpponentName(room)).to.equals(roomsDetails[0].players.opponent);
        done();
    });

    /// ///////////////////////////// getCreatorName /////////////////////////////
    it('should get the opponent name', (done: Mocha.Done) => {
        const room = 'room';
        const roomsDetails: RoomsDetails[] = [{
            roomName: 'principalRoom',
            players: {
                creator: 'ali',
                opponent: 'aldric',
            },
            targets: 'string',
            dictionaryName: 'string',
        }];
        multiplayerService.roomsDetails.push(roomsDetails[0]);
        expect(multiplayerService.getCreatorName(room)).to.equals('');
        done();
    });

    it('should not get the opponent name if its not the same room', (done: Mocha.Done) => {
        const room = 'room';
        const roomsDetails: RoomsDetails[] = [{
            roomName: 'room',
            players: {
                creator: 'ali',
                opponent: 'aldric',
            },
            targets: 'string',
            dictionaryName: 'string',
        }];
        multiplayerService.roomsDetails.push(roomsDetails[0]);
        expect(multiplayerService.getCreatorName(room)).to.equals(roomsDetails[0].players.creator);
        done();
    });
    /// ///////////////////////////// checkRoomExistance /////////////////////////////
    it('should return that the roomList is greater than 0 to check the existance', (done: Mocha.Done) => {
        const room = 'room';
        multiplayerService.checkRoomExistance(room);
        expect(multiplayerService.roomList.indexOf(room)).greaterThanOrEqual(-1);
        done();
    });
    /// ///////////////////////////// getRoomsList /////////////////////////////
    it('should return the roomList for the display', (done: Mocha.Done) => {
        const roomsList = multiplayerService.getRoomsList('log2990');
        expect(roomsList).to.equals(multiplayerService.roomListLog);
        done();
    });
    /// ///////////////////////////// deleteRoom /////////////////////////////
    it('should delete the room when the player is gone', (done: Mocha.Done) => {
        const room = 'room';
        const element = 'lala';
        multiplayerService.roomList.push(element);
        multiplayerService.roomList.push(room);
        multiplayerService.deleteRoom(room);
        expect(multiplayerService.roomList[0]).to.not.equals(multiplayerService.roomList[1]);
        done();
    });
});
