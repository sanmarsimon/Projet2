import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CLASSIC_RULES, LOG2990_RULES } from '@app/constant';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { CommunicationService } from '@app/services/communication.service';
import { GameMasterService } from '@app/services/game-master.service';
import { of } from 'rxjs';
// eslint-disable-next-line no-restricted-imports
import { HighScoresComponent } from '../high-scores/high-scores.component';
import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let communicationServiceSpy: SpyObj<CommunicationService>;
    let gameMasterSpy: SpyObj<GameMasterService>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        gameMasterSpy = jasmine.createSpyObj('GameMasterService', ['open']);
        communicationServiceSpy = jasmine.createSpyObj('ExampleService', ['basicGet', 'basicPost']);
        communicationServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
        communicationServiceSpy.basicPost.and.returnValue(of());

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: CommunicationService, useValue: communicationServiceSpy },
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: GameMasterService, useValue: gameMasterSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        expect(component.title).toEqual('LOG2990');
    });

    it('should open to insert player info', () => {
        component.openDialog();
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(GameModeComponent);
    });

    it('should set the LOG2990 mode', () => {
        const spy = spyOn(component, 'openDialog');
        component.setLOG2990();
        expect(gameMasterSpy.gameRules).toEqual(LOG2990_RULES);
        expect(spy).toHaveBeenCalled();
    });

    it('should set the setClassicRules', () => {
        const spy = spyOn(component, 'openDialog');
        component.setClassicRules();
        expect(gameMasterSpy.gameRules).toEqual(CLASSIC_RULES);
        expect(spy).toHaveBeenCalled();
    });

    it('should openDialogHighScores', () => {
        component.openDialogHighScores();
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(HighScoresComponent);
    });

    it('should call basicGet when calling getMessagesFromServer', () => {
        component.getMessagesFromServer();
        expect(communicationServiceSpy.basicGet).toHaveBeenCalled();
    });

    it('should call basicPost when calling sendTimeToServer', () => {
        component.sendTimeToServer();
        expect(communicationServiceSpy.basicPost).toHaveBeenCalled();
    });
});
