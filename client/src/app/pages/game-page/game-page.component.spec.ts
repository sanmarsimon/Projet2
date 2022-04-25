import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { ChevaletService } from '@app/services/chevalet.service';
import { GameMasterService } from '@app/services/game-master.service';
import { PlayerService } from '@app/services/player.service';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;
    let chevaletServiceSpyObj: jasmine.SpyObj<ChevaletService>;
    let gameMasterServiceSpy: jasmine.SpyObj<GameMasterService>;
    let playerServiceSpyObj: jasmine.SpyObj<PlayerService>;
    let sidebarComponent: jasmine.SpyObj<SidebarComponent>;

    beforeEach(async () => {
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['closeAll']);
        chevaletServiceSpyObj = jasmine.createSpyObj('ChevaletService', ['onKeyDown', 'onWheel']);
        gameMasterServiceSpy = jasmine.createSpyObj('GameMasterService', ['getGameMode', 'startGame ']);
        playerServiceSpyObj = jasmine.createSpyObj('PlayerService', ['']);
        sidebarComponent = jasmine.createSpyObj('SidebarComponent', ['verifyGameMode']);

        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: ChevaletService, useValue: chevaletServiceSpyObj },
                { provide: GameMasterService, useValue: gameMasterServiceSpy },
                { provide: PlayerService, useValue: playerServiceSpyObj },
                { provide: SidebarComponent, useValue: sidebarComponent },
            ],
            imports: [AppMaterialModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        sidebarComponent.verifyGameMode();
        component.letters = [];
        component.mousePosition = { x: 0, y: 0 };
        component.buttonPressed = '';
        // gameMasterServiceSpy.startGame();
    });

    it('should create', async () => {
        // gameMasterServiceSpy.gameMode = SINGLE_PLAYER_MODE;
        // gameMasterServiceSpy.gameRules = LOG2990_RULES;
        expect(component).toBeTruthy();
    });

    // it('should close all', () => {
    //     component.ngOnInit();
    //     expect(matDialogSpyObj.closeAll).toHaveBeenCalled();
    //     expect(component.letters).toBe(playerServiceSpyObj.letters);
    //     // expect(gameMasterServiceSpy.startGame).toHaveBeenCalled();
    // });

    // it('should onKeyDown', () => {
    //     chevaletServiceSpyObj.letters = [];
    //     chevaletServiceSpyObj.mousePosition = { x: 0, y: 0 };
    //     const event = { key: 'o', ctrlKey: true, preventDefault: jasmine.createSpyObj } as KeyboardEvent;
    //     component.onKeyDown(event);
    //     expect(chevaletServiceSpyObj.onKeyDown).toHaveBeenCalled();
    // });
    // it('should onWheel', () => {
    //     const event = {} as WheelEvent;
    //     component.onWheel(event);
    //     expect(chevaletServiceSpyObj.onWheel).toHaveBeenCalled();
    // });
});
