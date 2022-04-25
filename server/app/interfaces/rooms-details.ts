export interface RoomsDetails {
    roomName: string;
    players: {
        creator: string;
        opponent: string;
    };
    targets?: string;
    dictionaryName: string;
}
