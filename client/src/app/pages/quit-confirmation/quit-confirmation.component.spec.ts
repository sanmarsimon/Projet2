/* eslint-disable prettier/prettier */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { QuitConfirmationComponent } from './quit-confirmation.component';


describe('QuitConfirmationComponent', () => {
  let component: QuitConfirmationComponent;
  let fixture: ComponentFixture<QuitConfirmationComponent>;
  let matDialogRefSpyObj: jasmine.SpyObj<MatDialogRef<GameModeComponent>>;
  // // let routerSpyObj: jasmine.SpyObj<Router>;
  let multiplayerServiceSpyObj: jasmine.SpyObj<MultiplayerService>;
  let gameMasterServiceSpy: jasmine.SpyObj<GameMasterService>;


  beforeEach(async () => {
    // routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    multiplayerServiceSpyObj = jasmine.createSpyObj('MultiplayerService', ['']);
    gameMasterServiceSpy = jasmine.createSpyObj('GameMasterService', ['']);

    await TestBed.configureTestingModule({
      declarations: [QuitConfirmationComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpyObj },
        { provide: MultiplayerService, useValue: multiplayerServiceSpyObj },
        { provide: GameMasterService, useValue: gameMasterServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      imports: [MatDialogModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should quitGame', () => {
  //   component.quitGame();
  //   // expect(multiplayerServiceSpyObj.socket.disconnect);
  //   expect(routerSpyObj.navigateByUrl).toHaveBeenCalled();
  // });
});
