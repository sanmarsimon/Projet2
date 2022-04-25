import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
    let component: ConfirmationDialogComponent;
    let fixture: ComponentFixture<ConfirmationDialogComponent>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;
    let matDialogRefSpyObj: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

    beforeEach(async () => {
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['close']);
        matDialogRefSpyObj = jasmine.createSpyObj('MatDialog', ['']);

        await TestBed.configureTestingModule({
            declarations: [ConfirmationDialogComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: MatDialogRef, useValue: matDialogRefSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
            imports: [MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
