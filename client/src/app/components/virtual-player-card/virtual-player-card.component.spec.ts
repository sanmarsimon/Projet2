import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { GameMasterService } from '@app/services/game-master.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { VirtualPlayerCardComponent } from './virtual-player-card.component';

describe('VirtualPlayerCardComponent', () => {
    let component: VirtualPlayerCardComponent;
    let fixture: ComponentFixture<VirtualPlayerCardComponent>;
    let virtualPlayerServiceSpy: jasmine.SpyObj<VirtualPlayerService>;
    let gameMasterServiceSpy: jasmine.SpyObj<GameMasterService>;

    beforeEach(async () => {
        virtualPlayerServiceSpy = jasmine.createSpyObj('VirtualPlayerService', ['']);
        gameMasterServiceSpy = jasmine.createSpyObj('GameMasterService', ['']);

        await TestBed.configureTestingModule({
            declarations: [VirtualPlayerCardComponent],
            providers: [
                { provide: VirtualPlayerService, useValue: virtualPlayerServiceSpy },
                { provide: GameMasterService, useValue: gameMasterServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        virtualPlayerServiceSpy.currentScore = 10;
        virtualPlayerServiceSpy.letters = [];
        fixture = TestBed.createComponent(VirtualPlayerCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        const letters: Letter[] = [];
        virtualPlayerServiceSpy.letters = letters;
        expect(component).toBeTruthy();
    });
});
