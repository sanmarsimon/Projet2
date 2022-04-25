/* eslint-disable prettier/prettier */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { VirtualPlayerNameService } from './virtual-player-name.service';

describe('VirtualPlayerNameService', () => {
    let service: VirtualPlayerNameService;
    let httpSpy: jasmine.SpyObj<HttpClient>;


    beforeEach(() => {
        httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClient, useValue: httpSpy },

            ],
        });
        service = TestBed.inject(VirtualPlayerNameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
