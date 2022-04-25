import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameMasterService } from '@app/services/game-master.service';
import { EndGameCardComponent } from './end-game-card.component';

describe('EndGameCardComponent', () => {
    let component: EndGameCardComponent;
    let fixture: ComponentFixture<EndGameCardComponent>;
    let gameMasterServiceSpy: jasmine.SpyObj<GameMasterService>;

    beforeEach(async () => {
        gameMasterServiceSpy = jasmine.createSpyObj('GameMasterService', ['']);

        await TestBed.configureTestingModule({
            declarations: [EndGameCardComponent],
            providers: [{ provide: GameMasterService, useValue: gameMasterServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EndGameCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
