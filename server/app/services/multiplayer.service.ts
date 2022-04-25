import { LOG2990_RULES } from '@app/constants/constant';
import { RoomsDetails } from '@app/interfaces/rooms-details';
import { Service } from 'typedi';
@Service()
export class MultiplayerService {
    roomList: string[] = [];
    roomListLog: string[] = [];
    roomsDetails: RoomsDetails[] = [];

    createRoom(room: string, creator: string, dictName: string, gameRules: string) {
        if (gameRules === LOG2990_RULES) {
            this.roomListLog.push(room);
        } else {
            this.roomList.push(room);
        }
        this.roomsDetails.push({
            roomName: room,
            players: {
                creator,
                opponent: '',
            },
            dictionaryName: dictName,
        });
    }

    // setTargetIndexes(room: string) {
    //     const chosenTagets = [];
    //     let nextIndex = -1;
    //     let currentTargetIndex = nextIndex;
    //     while (chosenTagets.length < 2) {
    //         // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    //         nextIndex = Math.floor(Math.random() * 4);
    //         if (nextIndex !== currentTargetIndex) {
    //             chosenTagets.push(nextIndex);
    //             currentTargetIndex = nextIndex;
    //         }
    //     }
    //     const roomDetails = this.roomsDetails.filter((elem) => elem.roomName === room)[0];
    //     roomDetails.targets = chosenTagets.join(' ');
    // }

    // getRoomTargets(room: string): string {
    //     const roomDetails = this.roomsDetails.filter((elem) => elem.roomName === room)[0];
    //     return roomDetails.targets ? roomDetails.targets : '';
    // }

    addOpponentName(room: string, opponent: string) {
        for (const roomDetails of this.roomsDetails) {
            if (roomDetails.roomName === room) {
                roomDetails.players.opponent = opponent;
            }
        }
        return '';
    }

    getOpponentName(room: string) {
        for (const roomDetails of this.roomsDetails) {
            if (roomDetails.roomName === room) {
                return roomDetails.players.opponent;
            }
        }
        return '';
    }

    getCreatorName(room: string) {
        for (const roomDetails of this.roomsDetails) {
            if (roomDetails.roomName === room) {
                return roomDetails.players.creator;
            }
        }
        return '';
    }

    checkRoomExistance(room: string) {
        return this.roomList.indexOf(room) >= 0 || this.roomListLog.indexOf(room) >= 0;
    }

    getRoomsList(gameRules: string) {
        if (gameRules === LOG2990_RULES) {
            return this.roomListLog;
        } else {
            return this.roomList;
        }
    }

    deleteRoom(room: string) {
        this.roomList = this.roomList.filter((element) => element !== room);
        this.roomListLog = this.roomListLog.filter((element) => element !== room);
    }

    getDictName(room: string) {
        for (const roomDetails of this.roomsDetails) {
            if (roomDetails.roomName === room) {
                return roomDetails.dictionaryName;
            }
        }
        return '';
    }
}
