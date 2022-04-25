import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ELEMENT_NOT_FOUNDED } from '@app/constant';
import { Dict } from '@app/interfaces/dict';
import { Observable } from 'rxjs';

// import * as fs from 'fs';

// const fs = require('fs');

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    // fileNameValid = true;
    // fileContentValid = true;
    deletionIndex: number;
    text: string;
    dictList: Dict[] = [];
    errorMessage: string = '';
    deletionDialogForDict = false;
    url: string = 'http://localhost:3000/api/dictionary/';

    constructor(private http: HttpClient) {}

    async getList() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url).subscribe(
                (response) => {
                    if (response) {
                        this.dictList = response as Dict[];
                    }
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    async create() {
        // const obj = JSON.parse(txt);
        // console.log(typeof obj);
        return new Promise((resolve, reject) => {
            const obj = JSON.parse(this.text);
            const dict = new Dict(obj.title, obj.description, obj.words);
            this.http.post(this.url, dict).subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    async modify(index: number, dict: Dict) {
        return new Promise((resolve, reject) => {
            this.http.put(this.url + index, dict).subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    async delete() {
        return new Promise((resolve, reject) => {
            // const name = this.dictList[this.deletionIndex];
            this.http.delete(this.url + this.deletionIndex).subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    download(name: string) {
        this.http.get('http://localhost:3000/assets/' + name).subscribe((dataReceived) => {
            // console.log(dataReceived);
            this.downloadFile(JSON.stringify(dataReceived), name);
        });
    }

    downloadFile(data: string, name: string) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = name;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    nameValidation(name: string) {
        let nameValid = true;
        for (const dict of this.dictList) {
            if (dict.title === name) nameValid = false;
        }
        return nameValid;
    }

    uploadValidation(txt: string): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            this.errorMessage = '';
            let nameAndFormatValid = true;

            // file format verification (file should be a JSON)
            try {
                JSON.parse(txt);
            } catch {
                this.errorMessage = 'Not a JSON file';
                subscriber.next(false);
            }

            const obj = JSON.parse(txt);

            // dictionary name verification
            for (const dict of this.dictList) {
                if (dict.title === obj.title) {
                    nameAndFormatValid = false;
                    this.errorMessage = 'Nom existe déjà';
                }
            }
            // dictionary content verification
            if (!('title' in obj && 'description' in obj && 'words' in obj)) {
                nameAndFormatValid = false;
                this.errorMessage = 'Format du dictionnaire non valide';
            }

            subscriber.next(nameAndFormatValid);
        });
    }

    async readFile(e: Event) {
        return new Promise((resolve, reject) => {
            const target = e.target as HTMLInputElement;
            const file: File = (target.files as FileList)[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = async () => {
                const txt = reader.result as string;
                this.text = txt;
                this.uploadValidation(txt).subscribe(
                    (response) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    },
                );
            };
            reader.onerror = () => {
                this.errorMessage = 'Erreur lors de la lecture du fichier';
            };
        });
    }

    get defaultDictIndex() {
        for (let i = 0; i < this.dictList.length; i++) {
            if (this.dictList[i].title === 'Mon dictionnaire') return i;
        }
        return ELEMENT_NOT_FOUNDED;
    }
}
