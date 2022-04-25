/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { GameMasterService } from '@app/services/game-master.service';
import { LettersStockService } from '@app/services/letters-stock.service';
import { PlayerService } from '@app/services/player.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let matProgressBarModule: jasmine.SpyObj<MatProgressBarModule>;
    let letterBank: jasmine.SpyObj<LettersStockService>;
    let playerService: jasmine.SpyObj<PlayerService>;
    let virtualPlayer: jasmine.SpyObj<VirtualPlayerService>;
    let gameMaster: jasmine.SpyObj<GameMasterService>;

    beforeEach(async () => {
        matProgressBarModule = jasmine.createSpyObj('MatProgressBarModule', ['']);
        letterBank = jasmine.createSpyObj('LettersStockService', ['']);
        playerService = jasmine.createSpyObj('PlayerService', ['']);
        virtualPlayer = jasmine.createSpyObj('VirtualPlayerService', ['']);
        gameMaster = jasmine.createSpyObj('GameMasterService', ['getGameMode']);
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: MatProgressBarModule, useValue: matProgressBarModule },
                { provide: PlayerService, useValue: playerService },
                { provide: LettersStockService, useValue: letterBank },
                { provide: VirtualPlayerService, useValue: virtualPlayer },
                { provide: GameMasterService, useValue: gameMaster },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        letterBank.letterStock = [];
        playerService.publicTargets = [];
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        letterBank.letterStock = [];
        expect(component).toBeTruthy();
    });
});
