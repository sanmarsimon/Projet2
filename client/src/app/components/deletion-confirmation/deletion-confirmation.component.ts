import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DictionaryService } from '@app/services/dictionary.service';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';

@Component({
    selector: 'app-deletion-confirmation',
    templateUrl: './deletion-confirmation.component.html',
    styleUrls: ['./deletion-confirmation.component.scss'],
})
export class DeletionConfirmationComponent {
    // dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    confirmationMessage = false;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        @Inject(DictionaryService) public dictionaryService: DictionaryService,
        @Inject(VirtualPlayerNameService) public virtualPlayerNameService: VirtualPlayerNameService,
    ) {}

    deleteDict() {
        if (this.dictionaryService.deletionDialogForDict) {
            this.dictionaryService.delete().then(
                () => {
                    this.dialog.open(ConfirmationDialogComponent);
                    this.router.navigateByUrl('/admin/dictionary-list');
                    this.dictionaryService.getList();
                },
                () => {
                    //
                },
            );
            this.dictionaryService.deletionDialogForDict = false;
        } else {
            this.virtualPlayerNameService.delete().then(
                () => {
                    this.dialog.open(ConfirmationDialogComponent);
                    this.router.navigateByUrl('admin/virtual-player-name');
                    this.virtualPlayerNameService.getAdvancedList();
                    this.virtualPlayerNameService.getBeginnerList();
                },
                () => {
                    //
                },
            );
        }
    }
}
