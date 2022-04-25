/* eslint-disable @typescript-eslint/no-magic-numbers */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';
import { JoinRoomPanelComponent } from './join-room-panel.component';

describe('JoinRoomPanelComponent', () => {
    let component: JoinRoomPanelComponent;
    let fixture: ComponentFixture<JoinRoomPanelComponent>;
    let multiplayerServiceSpyObj: jasmine.SpyObj<MultiplayerService>;
    let gameMasterServiceSpyObj: jasmine.SpyObj<GameMasterService>;
    let playerServiceSpyObj: jasmine.SpyObj<PlayerService>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let matDialogRefSpyObj: jasmine.SpyObj<MatDialogRef<GameModeComponent>>;

    beforeEach(async () => {
        multiplayerServiceSpyObj = jasmine.createSpyObj('MultiplayerService', ['getRooms', 'joinRoom', 'getCreatorName', 'deleteRoom']);
        gameMasterServiceSpyObj = jasmine.createSpyObj('GameMasterService', ['setGameMode', 'setRoom']);
        playerServiceSpyObj = jasmine.createSpyObj('GameMasterService', ['setOpponentName', 'setPlayerName']);
        routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
        await TestBed.configureTestingModule({
            declarations: [JoinRoomPanelComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: MultiplayerService, useValue: multiplayerServiceSpyObj },
                { provide: MatDialogRef, useValue: matDialogRefSpyObj },
                { provide: GameMasterService, useValue: gameMasterServiceSpyObj },
                { provide: PlayerService, useValue: playerServiceSpyObj },
                { provide: Router, useValue: routerSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
            imports: [MatDialogModule, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        // multiplayerServiceSpyObj.getCreatorName('aldric').then((res) => {
        //     component.opponentName = res;
        // });

        fixture = TestBed.createComponent(JoinRoomPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    /// /////////////////////////////////////  CREATING COMPONENT ////////////////////////

    it('should exist', () => {
        component.namePlayer = new FormControl('');
        component.roomList = ['salle1', 'salle2'];
        multiplayerServiceSpyObj.getRooms('rools');
        expect(component).toBeTruthy();
    });
    /// /////////////////////////////////////  startGame ////////////////////////

    it('should startGame', async () => {
        component.namePlayer = new FormControl('aldric');
        await multiplayerServiceSpyObj.getCreatorName('aldric');

        await multiplayerServiceSpyObj.joinRoom('room', 'manal');

        await component.startGame();
        expect(routerSpyObj.navigateByUrl).toHaveBeenCalled();
        expect(gameMasterServiceSpyObj.setGameMode).toHaveBeenCalled();
        expect(playerServiceSpyObj.setOpponentName).toHaveBeenCalled();
        expect(playerServiceSpyObj.setPlayerName).toHaveBeenCalled();
        expect(multiplayerServiceSpyObj.deleteRoom).toHaveBeenCalled();
    });
    // it('should not startGame', async () => {
    //     component.namePlayer = new FormControl('aldric');
    //     await multiplayerServiceSpyObj.getCreatorName('aldric');
    //     await multiplayerServiceSpyObj.joinRoom('room', 'manal');
    //
    //     await component.startGame();
    //     expect(component.sameNameError).toEqual(true);
    // });
    // it('should start a game', async () => {
    //     await multiplayerServiceSpyObj.getCreatorName('aldric');
    //     component.namePlayer = new FormControl('aldric');

    //     component.startGame();
    //     expect(component.sameNameError).toBeFalse();
    // });
    /// /////////////////////////////////////  onRoomChoose ////////////////////////
    it('should choose a room', async () => {
        const res = (component.roomName = 'hello');
        component.onRoomChoose();
        expect(component.showCreatorName).toBeFalse();
        expect(component.opponentName).toEqual(await multiplayerServiceSpyObj.getCreatorName(res));
    });
    it('should usernameHasWhitespace', async () => {
        component.roomName = '';
        component.onRoomChoose();
        expect(component.showCreatorName).toBeFalse();
    });
    /// /////////////////////////////////////  usernameHasWhitespace ////////////////////////
    it('should usernameHasWhitespace', () => {
        const regexp = new RegExp(' ');
        const namePlayerValue = component.namePlayer.value;
        component.usernameHasWhitespace();
        expect(component.hasWhitespace).toEqual(regexp.test(namePlayerValue));
    });

    /// /////////////////////////////////////  onChangeWrapper ////////////////////////

    it('should onChangeWrapper', () => {
        const spy2 = spyOn(component, 'usernameHasWhitespace');
        component.onChangeWrapper();
        expect(spy2).toHaveBeenCalled();
    });
    /// /////////////////////////////////////  onReturnClick ////////////////////////

    it('should delete the room when we clik on return click', () => {
        component.onReturnClick();
        expect(routerSpyObj.navigateByUrl).toHaveBeenCalled();
    });
});
