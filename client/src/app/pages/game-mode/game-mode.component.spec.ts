import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { InfoPlayerComponent } from '@app/pages/info-player/info-player.component';
import { JoinRoomPanelComponent } from '@app/pages/join-room-panel/join-room-panel.component';
import { MultiplayerConfigPanelComponent } from '@app/pages/multiplayer-config-panel/multiplayer-config-panel.component';
import { GameModeComponent } from './game-mode.component';

describe('GameModeComponent', () => {
    let component: GameModeComponent;
    let fixture: ComponentFixture<GameModeComponent>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            declarations: [GameModeComponent],
            providers: [{ provide: MatDialog, useValue: matDialogSpyObj }],
            imports: [AppMaterialModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameModeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should open to insert player info', () => {
        component.openDialog();
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(InfoPlayerComponent);
    });
    it('should open a multiplayer dialog', () => {
        component.openMulitplayerDialog();
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(MultiplayerConfigPanelComponent);
    });
    it('should open a join room  dialog', () => {
        component.openJoinRoomDialog();
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(JoinRoomPanelComponent);
    });
});
