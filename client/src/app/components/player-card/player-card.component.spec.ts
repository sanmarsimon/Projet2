import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameMasterService } from '@app/services/game-master.service';
import { PlayerService } from '@app/services/player.service';
import { PlayerCardComponent } from './player-card.component';

describe('PlayerCardComponent', () => {
    let component: PlayerCardComponent;
    let fixture: ComponentFixture<PlayerCardComponent>;
    let playerServiceSpyObj: jasmine.SpyObj<PlayerService>;
    let gameMasterService: jasmine.SpyObj<GameMasterService>;

    beforeEach(async () => {
        playerServiceSpyObj = jasmine.createSpyObj('PlayerService', ['placeWord', 'addLetter', 'findValueToLetter', 'isLetterFound']);
        gameMasterService = jasmine.createSpyObj('GameMasterService', ['']);

        await TestBed.configureTestingModule({
            declarations: [PlayerCardComponent],
            providers: [
                { provide: PlayerService, useValue: playerServiceSpyObj },
                { provide: GameMasterService, useValue: gameMasterService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        playerServiceSpyObj.pointsGained = 5;
        playerServiceSpyObj.letters = [];
        fixture = TestBed.createComponent(PlayerCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
