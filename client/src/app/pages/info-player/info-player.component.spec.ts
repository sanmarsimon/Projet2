/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HARD_LEVEL, HARD_LEVEL_MESSAGE, REGULAR_LEVEL, REGULAR_LEVEL_MESSAGE } from '@app/constant';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { PlayerService } from '@app/services/player.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { InfoPlayerComponent } from './info-player.component';

describe('InfoPlayerComponent', () => {
    let component: InfoPlayerComponent;
    let fixture: ComponentFixture<InfoPlayerComponent>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;
    let matDialogRefSpyObj: jasmine.SpyObj<MatDialogRef<GameModeComponent>>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let playerService: jasmine.SpyObj<PlayerService>;
    let virtualPlayerService: jasmine.SpyObj<VirtualPlayerService>;

    beforeEach(async () => {
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['closeAll']);
        matDialogRefSpyObj = jasmine.createSpyObj('MatDialog', ['']);
        playerService = jasmine.createSpyObj('PlayerService', ['']);
        virtualPlayerService = jasmine.createSpyObj('VirtualPlayerService', ['']);
        routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

        await TestBed.configureTestingModule({
            declarations: [InfoPlayerComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: Router, useValue: routerSpyObj },
                { provide: MatDialogRef, useValue: matDialogRefSpyObj },
                { provide: PlayerService, useValue: playerService },
                { provide: VirtualPlayerService, useValue: virtualPlayerService },
            ],
            imports: [MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /// //////////////////////// onChangeWrapper ////////////////////
    it('should call the selector opponent name and username hash', () => {
        const spy1 = spyOn(component, 'selectOpponentName');
        const spy2 = spyOn(component, 'usernameHasWhitespace');
        component.onChangeWrapper();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
    /// //////////////////////// usernameHasWhitespace ////////////////////
    it('should call the selector opponent name and username hash', () => {
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

    /// /////////////////////////////////////  buttonDetect ////////////////////////

    it('should buttonDetect', () => {
        const event = {
            key: 'Enter',
            preventDefault: jasmine.createSpyObj,
            stopPropagation: jasmine.createSpyObj,
        } as KeyboardEvent;
        const preventDefaultSpy = spyOn(event, 'preventDefault');
        const stopPropagationSpy = spyOn(event, 'stopPropagation');
        component.namePlayer = new FormControl('kakskskskks');

        component.buttonDetect(event);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(routerSpyObj.navigate).toHaveBeenCalled();
    });

    /// /////////////////////////////////////  onChangeLevel ////////////////////////

    it('should return the level degree', () => {
        component.difficulty = '';
        component.onChangeLevel();
        expect(virtualPlayerService.difficulty).toEqual(component.difficulty);
    });

    it('should return the level degree: hard', () => {
        component.difficulty = HARD_LEVEL;
        component.onChangeLevel();
        expect(component.difficultyMessage).toEqual(HARD_LEVEL_MESSAGE);
    });

    it('should return the level degree: regular', () => {
        component.difficulty = REGULAR_LEVEL;
        component.onChangeLevel();
        expect(component.difficultyMessage).toEqual(REGULAR_LEVEL_MESSAGE);
    });
});
