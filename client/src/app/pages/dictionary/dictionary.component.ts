import { Component, OnInit } from '@angular/core';
import { DictionaryService } from '@app/services/dictionary.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from '@app/components/deletion-confirmation/deletion-confirmation.component';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { ELEMENT_NOT_FOUNDED } from '@app/constant';

@Component({
    selector: 'app-dictionary',
    templateUrl: './dictionary.component.html',
    styleUrls: ['./dictionary.component.scss'],
})
export class DictionaryComponent implements OnInit {
    // defaultDictIndex: number;
    serverNotFound = false;
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    constructor(private dictionaryService: DictionaryService, private router: Router, public dialog: MatDialog) {
        // this.defaultDictIndex = this.dictionaryService.defaultDictIndex;
    }

    ngOnInit(): void {
        this.dictionaryService.getList().then(
            () => {
                this.serverNotFound = false;
                this.router.navigate(['admin/dictionary-list']);
            },
            () => {
                this.serverNotFound = true;
            },
        );
    }

    get dictionaries() {
        return this.dictionaryService.dictList;
    }

    onModify(index: number) {
        this.router.navigate(['admin/modify-dict/' + String(index)]);
    }

    onDelete(index: number) {
        this.dictionaryService.deletionIndex = index;
        this.dictionaryService.deletionDialogForDict = true;
        this.dialog.open(DeletionConfirmationComponent);
    }

    onDownload(index: number) {
        const name = index === this.defaultDictIndex ? 'dictionnary.json' : this.dictionaryService.dictList[index].title + '.json';
        this.dictionaryService.download(name);
    }

    get defaultDictIndex() {
        for (let i = 0; i < this.dictionaryService.dictList.length; i++) {
            if (this.dictionaryService.dictList[i].title === 'Mon dictionnaire') return i;
        }
        return ELEMENT_NOT_FOUNDED;
    }
}
