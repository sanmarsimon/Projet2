/* eslint-disable prettier/prettier */
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';
import { OpponentCardComponent } from './opponent-card.component';

describe('OpponentCardComponent', () => {
  let component: OpponentCardComponent;
  let fixture: ComponentFixture<OpponentCardComponent>;
  let multiplayerServiceSpy: jasmine.SpyObj<MultiplayerService>;
  let gameMasterServiceSpy: jasmine.SpyObj<GameMasterService>;
  let playerServiceSpy: jasmine.SpyObj<PlayerService>;


  beforeEach(async () => {
    multiplayerServiceSpy = jasmine.createSpyObj('MultiplayerService', ['listenTunnel']);
    gameMasterServiceSpy = jasmine.createSpyObj('GameMasterService', ['']);
    playerServiceSpy = jasmine.createSpyObj('PlayerService', ['']);


    await TestBed.configureTestingModule({
      declarations: [OpponentCardComponent],
      providers: [
        { provide: MultiplayerService, useValue: multiplayerServiceSpy },
        { provide: GameMasterService, useValue: gameMasterServiceSpy },
        { provide: PlayerService, useValue: playerServiceSpy },
      ],
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpponentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    // const hey: Observable<string>;
    // const spy = spyOn(multiplayerServiceSpy, 'listenTunnel').and.returnValue('allo');
    // const spy2 = spyOn(multiplayerServiceSpy.listenTunnel('a'), 'subscribe');
    // expect(spy).toHaveBeenCalledBefore(spy2);
    expect(component).toBeTruthy();
  }));

  // it('should listenLetterLength', () => {
  //   const letterLength = '';
  //   spyOn(multiplayerServiceSpy, 'listenTunnel').and.returnValue({
  //     // eslint-disable-next-line @typescript-eslint/no-empty-function
  //     subscribe: () => {
  //     }

  //   });
  //   component.listenLetterLength();
  //   expect(component.letterLength).toEqual(letterLength);

  // });


  // it('should create', () => {
  //   spyOn(component, 'ngOnDestroy').and.returnValue({
  //     // eslint-disable-next-line @typescript-eslint/no-empty-function
  //     unsubscribe: () => {}
  //   });
  //   component.ngOnDestroy();
  //   expect(component.letterLengthSubscription.unsubscribe).toHaveBeenCalled();
});

