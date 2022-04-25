import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { VirtualPlayerNameDialogComponent } from './virtual-player-name-dialog.component';

describe('NewVirtualPlayerNameComponent', () => {
    let component: VirtualPlayerNameDialogComponent;
    let fixture: ComponentFixture<VirtualPlayerNameDialogComponent>;
    let matDialogRefSpyObj: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;
    let virtualPlayerNameService: jasmine.SpyObj<MatDialogRef<VirtualPlayerNameService>>;
    let routerSpyObj: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        virtualPlayerNameService = jasmine.createSpyObj('DictionaryService', ['validation', 'modify', 'create']);
        routerSpyObj = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

        await TestBed.configureTestingModule({
            declarations: [VirtualPlayerNameDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpyObj },
                { provide: Router, useValue: routerSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: VirtualPlayerNameService, useValue: virtualPlayerNameService },
            ],
            imports: [MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VirtualPlayerNameDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
