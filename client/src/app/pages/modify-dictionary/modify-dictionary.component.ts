import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryService } from '@app/services/dictionary.service';
import { Dict } from '@app/interfaces/dict';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-modify-dictionary',
    templateUrl: './modify-dictionary.component.html',
    styleUrls: ['./modify-dictionary.component.scss'],
})
export class ModifyDictionaryComponent implements OnInit {
    dictForm: FormGroup;
    errorMessage: string;
    index: number;
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private dictionaryService: DictionaryService,
    ) {}

    ngOnInit(): void {
        this.dictForm = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
        });
        this.route.params.subscribe((params) => {
            this.index = params.id;
        });
    }

    onSubmit() {
        const formValue = this.dictForm.value;
        const dict = new Dict(formValue.title, formValue.description, []);
        const nameValid = this.dictionaryService.nameValidation(formValue.title);
        if (nameValid) {
            this.dictionaryService.modify(this.index, dict).then(
                () => {
                    this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
                    this.dialogRef.componentInstance.title = 'Modification Reussi';
                    this.dialogRef.componentInstance.message = 'Le dictionnaire a été modifié !';
                    this.router.navigateByUrl('/admin/dictionary-list');
                },
                (error) => {
                    this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
                    this.dialogRef.componentInstance.title = 'Echec de modification';
                    this.dialogRef.componentInstance.message = error;
                    this.dictForm.reset();
                },
            );
        } else {
            this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
            this.dialogRef.componentInstance.title = 'Echec de modification';
            this.dialogRef.componentInstance.message = 'Le nom existe déjà. Choississez un autre !';
            this.dictForm.reset();
        }
    }
}
