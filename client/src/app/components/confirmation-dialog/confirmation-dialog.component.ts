import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { Router } from '@angular/router';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
    title: string = 'Suppresion Reussi';
    message: string = 'Objet enlevé de la liste';

    constructor(
        // private router: Router,
        @Inject(MAT_DIALOG_DATA) public dialog: MatDialog,
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    ) {}
}
