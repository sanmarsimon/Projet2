/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CommunicationBoxComponent } from '@app/components/communication-box/communication-box.component';
import { CommandService } from '@app/services/command-service';
import { PlayerService } from '@app/services/player.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
// import { VirtualPlayerService } from '@app/services/virtual-player.service';

describe('CommunicationBoxComponent', () => {
    let component: CommunicationBoxComponent;
    let fixture: ComponentFixture<CommunicationBoxComponent>;
    let virtualPlayerServiceSpy: jasmine.SpyObj<VirtualPlayerService>;
    let playerServiceSpyObj: jasmine.SpyObj<PlayerService>;
    let commandServiceSpy: jasmine.SpyObj<CommandService>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        virtualPlayerServiceSpy = jasmine.createSpyObj('VirtualPlayerService', ['getVirtualPlayerName', 'initVirtualPlayerBoard']);
        playerServiceSpyObj = jasmine.createSpyObj('PlayerService', ['placeWord', 'addLetter', 'findValueToLetter', 'isLetterFound']);
        commandServiceSpy = jasmine.createSpyObj('CommandService', ['placeWord', 'addLetter', 'findValueToLetter', 'isLetterFound']);
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            declarations: [CommunicationBoxComponent],
            providers: [
                { provide: VirtualPlayerService, useValue: virtualPlayerServiceSpy },
                { provide: PlayerService, useValue: playerServiceSpyObj },
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: CommandService, useValue: commandServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunicationBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should setCurrentPlayerName', () => {
        const res = 'hugo';
        component.setCurrentPlayerName(res);
        expect(component.currentPlayerName).toEqual(res);
    });

    it('should commandSwitch', () => {
        const res = 'hugo';
        component.setCurrentPlayerName(res);
        expect(component.currentPlayerName).toEqual(res);
    });

    it('should call helpcommand()', () => {
        spyOn(component, 'helpCommand');
        component.command += '!aide';
        component.messageType();
        expect(component.helpCommand).toHaveBeenCalled();
    });
    it('should call initCommand', () => {
        spyOn(component, 'initCommand');
        component.command += '!placer h8h test';
        component.messageType();
        expect(component.initCommand).toHaveBeenCalled();
    });
});
