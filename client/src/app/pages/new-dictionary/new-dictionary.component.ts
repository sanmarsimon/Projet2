import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DictionaryService } from '@app/services/dictionary.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { Dict } from '@app/interfaces/dict';

@Component({
    selector: 'app-new-dictionary',
    templateUrl: './new-dictionary.component.html',
    styleUrls: ['./new-dictionary.component.scss'],
})
export class NewDictionaryComponent implements OnInit {
    @ViewChild('inputFile') myInputVariable: ElementRef;
    // dictForm: FormGroup;
    fileForm: FormGroup;
    errorMessage: string;
    nameAndFormatValid: boolean;
    // contentValid: boolean;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    constructor(private formBuilder: FormBuilder, private router: Router, public dictionaryService: DictionaryService, public dialog: MatDialog) {}

    ngOnInit(): void {
        // this.dictForm = this.formBuilder.group({
        //     title: ['', Validators.required],
        //     description: ['', Validators.required],
        //     fileName: ['', Validators.required],
        // });
        this.fileForm = this.formBuilder.group({
            newfile: ['', Validators.required],
        });
        // this.dictionaryService.fileNameValid = this.nameValid;
        // this.dictionaryService.fileContentValid = this.contentValid;
    }

    onSubmit() {
        // const formValue = this.dictForm.value;
        // const newDict = new Dict(formValue.title, formValue.description, []);
        // // newDict.fileName = formValue.fileName;
        // this.dictionaryService.createNewDict(newDict);

        this.dictionaryService.create().then(
            () => {
                this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
                this.dialogRef.componentInstance.title = 'Televersement Reussi';
                this.dialogRef.componentInstance.message = 'Le dictionnaire a été envoyé au serveur !';
                this.router.navigateByUrl('/admin/dictionary-list');
            },
            (error) => {
                this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
                this.dialogRef.componentInstance.title = 'Echec du televersement';
                this.dialogRef.componentInstance.message = error;
                this.reset();
            },
        );
    }

    onChange(event: Event) {
        this.dictionaryService.readFile(event).then(
            (valid) => {
                if (!valid) {
                    this.nameAndFormatValid = false;
                    this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
                    this.dialogRef.componentInstance.title = 'Echec du televersement';
                    this.dialogRef.componentInstance.message = this.dictionaryService.errorMessage;
                    this.reset();
                } else this.nameAndFormatValid = true;
            },
            (error) => {
                this.errorMessage = error;
            },
        );

        // this.dictionaryService.validation().subscribe((data) => {
        //     if (!data) {
        //         this.nameAndFormatValid = false;
        //         this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
        //         this.dialogRef.componentInstance.title = 'Echec du televersement';
        //         this.dialogRef.componentInstance.message = 'Le nom du dictionnaire existe déjà !';
        //         this.reset();
        //     } else this.nameAndFormatValid = true;
        // });
        // this.dictionaryService.validation();
        // this.verification();

        // console.log('Component : ' + this.nameValid + this.contentValid);
    }

    // verification() {
    //     if (!this.dictionaryService.fileNameValid) {
    //         this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
    //         this.dialogRef.componentInstance.title = 'Echec du televersement';
    //         this.dialogRef.componentInstance.message = 'Le nom du dictionnaire existe déjà !';
    //         this.reset();
    //     } else if (!this.dictionaryService.fileContentValid) {
    //         this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
    //         this.dialogRef.componentInstance.title = 'Echec du televersement';
    //         this.dialogRef.componentInstance.message = 'Le contenu du dictionnaire ne respecte pas le bon format';
    //         this.reset();
    //         // this.router.navigate(['/admin/dictionary-list']);
    //     }
    // }
    reset() {
        this.myInputVariable.nativeElement.value = '';
    }
}
