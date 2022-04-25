import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { DictionaryService } from '@app/services/dictionary.service';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { DeletionConfirmationComponent } from './deletion-confirmation.component';

describe('DeletionConfirmationComponent', () => {
    let component: DeletionConfirmationComponent;
    let fixture: ComponentFixture<DeletionConfirmationComponent>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;
    let matDialogRefSpyObj: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let dictionaryService: jasmine.SpyObj<DictionaryService>;
    let virtualPlayerNameService: jasmine.SpyObj<VirtualPlayerNameService>;
    beforeEach(async () => {
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['close']);
        matDialogRefSpyObj = jasmine.createSpyObj('MatDialog', ['']);
        routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
        dictionaryService = jasmine.createSpyObj('DictionaryService', ['delete']);
        virtualPlayerNameService = jasmine.createSpyObj('VirtualPlayerNameService', ['delete', 'getAdvancedList', 'getBeginnerList']);

        await TestBed.configureTestingModule({
            declarations: [DeletionConfirmationComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: MatDialogRef, useValue: matDialogRefSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: Router, useValue: routerSpyObj },
                { provide: DictionaryService, useValue: dictionaryService },
                { provide: VirtualPlayerNameService, useValue: virtualPlayerNameService },
            ],
            imports: [MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        dictionaryService.delete();
        fixture = TestBed.createComponent(DeletionConfirmationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
