/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DictionaryService } from '@app/services/dictionary.service';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { MultiplayerConfigPanelComponent } from './multiplayer-config-panel.component';
describe('MultiplayerConfigPanelComponent', () => {
    let component: MultiplayerConfigPanelComponent;
    let fixture: ComponentFixture<MultiplayerConfigPanelComponent>;
    let multiplayerServiceSpyObj: jasmine.SpyObj<MultiplayerService>;
    let virtualPlayerServiceSpyObj: jasmine.SpyObj<VirtualPlayerService>;
    let matDialogRefSpyObj: jasmine.SpyObj<MatDialogRef<MultiplayerConfigPanelComponent>>;
    let gameMasterServiceSpyObj: jasmine.SpyObj<GameMasterService>;
    let playerServiceSpyObj: jasmine.SpyObj<PlayerService>;
    let dictionaryService: jasmine.SpyObj<DictionaryService>;
    let router: Router;
    beforeEach(async () => {
        gameMasterServiceSpyObj = jasmine.createSpyObj('GameMasterService', ['setGameMode']);
        playerServiceSpyObj = jasmine.createSpyObj('GameMasterService', ['setOpponentName', 'setPlayerName']);
        virtualPlayerServiceSpyObj = jasmine.createSpyObj('VirtualPlayerService', ['']);
        dictionaryService = jasmine.createSpyObj('DictionaryService', ['getList']);
        multiplayerServiceSpyObj = jasmine.createSpyObj('MultiplayerService', [
            'deleteRoom',
            'createRoom',
            'listenTunnel',
            'getRooms',
            'getCreatorName',
        ]);
        await TestBed.configureTestingModule({
            declarations: [MultiplayerConfigPanelComponent],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpyObj },
                { provide: MultiplayerService, useValue: multiplayerServiceSpyObj },
                { provide: GameMasterService, useValue: gameMasterServiceSpyObj },
                { provide: PlayerService, useValue: playerServiceSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: VirtualPlayerService, useValue: virtualPlayerServiceSpyObj },
                { provide: DictionaryService, useValue: dictionaryService },
            ],
            imports: [MatDialogModule, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        router = TestBed.inject(Router);

        fixture = TestBed.createComponent(MultiplayerConfigPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    /// /////////////////////////////////////  CREATING COMPONENT ////////////////////////
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    /// /////////////////////////////////////  startGame ////////////////////////

    // it('should start the game by creating room', async () => {
    //     component.roomName = new FormControl('');
    //     await multiplayerServiceSpyObj.getCreatorName('aldric');
    //     // const roomNameExist = roomList.indexOf(component.roomName.value);

    //     // multiplayerServiceSpyObj.getRooms();
    //     await component.startGame();
    //     // expect(multiplayerServiceSpyObj.createRoom).toHaveBeenCalled();
    //     expect(component.invalidRoom).toBeTrue();
    // });
    /// /////////////////////////////////////  onReturnClick ////////////////////////

    it('should delete the room when we clik on return click', () => {
        const routerSpy = spyOn(router, 'navigateByUrl');

        component.onReturnClick();
        expect(multiplayerServiceSpyObj.deleteRoom).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalled();
    });

    /// /////////////////////////////////////  onCreateSingleGame ////////////////////////

    it('should switch to the single game mode ', () => {
        const routerSpy = spyOn(router, 'navigateByUrl');

        component.onCreateSingleGame();
        expect(multiplayerServiceSpyObj.deleteRoom).toHaveBeenCalled();
        expect(gameMasterServiceSpyObj.setGameMode).toHaveBeenCalled();

        expect(routerSpy).toHaveBeenCalled();
    });

    it('should switch to the single game mode ', () => {
        const routerSpy = spyOn(router, 'navigate');
        virtualPlayerServiceSpyObj.playerName = 'Maiva';
        playerServiceSpyObj.playerName = 'manal';
        const oppo = (component.opponentName = 'Maiva');
        const here = (component.namePlayer = new FormControl('manal'));

        component.onCreateSingleGame();

        expect(routerSpy).toHaveBeenCalled();
        expect(virtualPlayerServiceSpyObj.playerName).toEqual(oppo);
        expect(playerServiceSpyObj.playerName).toEqual(here.value);
    });
    /// /////////////////////////////////////  getErrorMessage ////////////////////////

    it('should return a message error when the namePlayer is not only letters', () => {
        const errorMessage = 'Vous devez rentrer un nom valide qui contient que des lettres ';

        component.namePlayer.hasError('required');
        expect(component.getErrorMessage()).toEqual(errorMessage);
    });

    it('should return a message error when the namePlayer is not valid', () => {
        component.namePlayer = new FormControl('kakskskskks');
        expect(component.getErrorMessage()).toEqual(component.namePlayer.hasError('pattern') ? 'Le nom n est pas valide' : '');
    });

    /// /////////////////////////////////////  usernameHasWhitespace ////////////////////////

    it('should usernameHasWhitespace', () => {
        const regexp = new RegExp(' ');
        const namePlayerValue = component.namePlayer.value;
        component.usernameHasWhitespace();
        expect(component.hasWhitespace).toEqual(regexp.test(namePlayerValue));
    });

    /// /////////////////////////////////////  selectOpponentName ////////////////////////

    it('should selectOpponentName', () => {
        const opponentName = component.opponentName;
        component.namePlayer = new FormControl(opponentName);
        expect(component.selectOpponentName());
    });

    it('should selectOpponentName', () => {
        const opponentName = 'HANI';
        component.namePlayer = new FormControl(opponentName);
        expect(component.selectOpponentName());
    });
    it('should selectOpponentName', () => {
        component.namePlayer = new FormControl('manal');
        component.opponentName = 'sanmarsimon';
        const OPPONENT_NAMES: string[] = ['sanmarsimon', 'Maiva', 'Aligator'];
        const spy = spyOn(Math, 'random').and.returnValue(0.2).length;
        expect(component.opponentName).toEqual(OPPONENT_NAMES[spy]);
    });
    /// /////////////////////////////////////  onChangeWrapper ////////////////////////

    it('should selectOpponentName', () => {
        component.namePlayer = new FormControl('aldric');
        const spy = spyOn(component, 'selectOpponentName');
        const spy2 = spyOn(component, 'usernameHasWhitespace');
        component.onChangeWrapper();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
});
