/* eslint-disable prettier/prettier */
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
    let service: DictionaryService;
    let httpSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClient, useValue: httpSpy },

            ],
        });
        service = TestBed.inject(DictionaryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });


});
