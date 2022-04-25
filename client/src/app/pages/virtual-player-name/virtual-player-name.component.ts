import { Component, OnInit } from '@angular/core';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from '@app/components/deletion-confirmation/deletion-confirmation.component';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { DictionaryService } from '@app/services/dictionary.service';
import { VirtualPlayerNameDialogComponent } from '@app/pages/virtual-player-name-dialog/virtual-player-name-dialog.component';

@Component({
    selector: 'app-virtual-player-name',
    templateUrl: './virtual-player-name.component.html',
    styleUrls: ['./virtual-player-name.component.scss'],
})
export class VirtualPlayerNameComponent implements OnInit {
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    serverNotFound = false;
    constructor(
        private virtualPlayerNameService: VirtualPlayerNameService,
        private dictionaryService: DictionaryService,
        private router: Router,
        public dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.virtualPlayerNameService.getAdvancedList().then(
            () => {
                this.router.navigate(['admin/virtual-player-name']);
            },
            () => {
                this.serverNotFound = true;
            },
        );

        this.virtualPlayerNameService.getBeginnerList().then(
            () => {
                this.router.navigate(['admin/virtual-player-name']);
            },
            () => {
                this.serverNotFound = true;
            },
        );
    }

    get advancedPlayerNames() {
        return this.virtualPlayerNameService.advancedPlayer;
    }

    get beginnerPlayerNames() {
        return this.virtualPlayerNameService.beginnerPlayer;
    }

    onCreate() {
        this.dialog.open(VirtualPlayerNameDialogComponent);
    }

    onModify(index: number, category: string) {
        this.virtualPlayerNameService.modificationIndex = index;
        this.virtualPlayerNameService.modificationCategory = category;
        this.virtualPlayerNameService.modificationDialog = true;
        this.dialog.open(VirtualPlayerNameDialogComponent);
    }

    onDelete(index: number, category: string) {
        this.virtualPlayerNameService.deletionIndex = index;
        this.virtualPlayerNameService.deletionCategory = category;
        this.dictionaryService.deletionDialogForDict = false;
        this.dialog.open(DeletionConfirmationComponent);
    }
}
