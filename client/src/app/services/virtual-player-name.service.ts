import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerNameService {
    advancedPlayer: string[] = [];
    beginnerPlayer: string[] = [];
    deletionIndex: number;
    deletionCategory: string;
    modificationIndex: number;
    modificationCategory: string;
    errorMessage: string = '';
    modificationDialog = false;
    url: string = 'http://localhost:3000/api/vpn/';

    constructor(private http: HttpClient) {}

    async getAdvancedList() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + 'advanced').subscribe(
                (response) => {
                    if (response) {
                        this.advancedPlayer = response as string[];
                    }
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    async getBeginnerList() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + 'beginner').subscribe(
                (response) => {
                    if (response) {
                        this.beginnerPlayer = response as string[];
                    }
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    async create(name: string, category: string) {
        return new Promise((resolve, reject) => {
            this.http.post(this.url, { name, category }).subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    async modify(newName: string) {
        return new Promise((resolve, reject) => {
            const index = this.modificationIndex;
            const category = this.modificationCategory;
            let name: string;
            if (category === 'advanced') {
                name = this.advancedPlayer[index];
            } else {
                name = this.beginnerPlayer[index];
            }
            this.http.put(this.url + name, { newName, category }).subscribe(
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
            const index = this.deletionIndex;
            const name = this.deletionCategory === 'advanced' ? this.advancedPlayer[index] : this.beginnerPlayer[index];
            this.http.delete(this.url + name).subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    validation(name: string): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            let nameValid = true;
            for (const element of this.advancedPlayer) {
                if (element === name) {
                    nameValid = false;
                    this.errorMessage = 'Nom existe déjà';
                }
            }
            for (const element of this.beginnerPlayer) {
                if (element === name) {
                    nameValid = false;
                    this.errorMessage = 'Nom existe déjà';
                }
            }
            subscriber.next(nameValid);
        });
    }
}
