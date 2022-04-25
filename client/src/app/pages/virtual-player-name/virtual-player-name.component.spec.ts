import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryService } from '@app/services/dictionary.service';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { VirtualPlayerNameComponent } from './virtual-player-name.component';

describe('VirtualPlayerNameComponent', () => {
    let component: VirtualPlayerNameComponent;
    let fixture: ComponentFixture<VirtualPlayerNameComponent>;
    let virtualPlayerNameServiceSpyObj: jasmine.SpyObj<VirtualPlayerNameService>;
    let dictionaryService: jasmine.SpyObj<DictionaryService>;
    let routerSpyObj: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        virtualPlayerNameServiceSpyObj = jasmine.createSpyObj('VirtualPlayerNameService', ['getAdvancedList']);
        dictionaryService = jasmine.createSpyObj('DictionaryService', ['']);
        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [VirtualPlayerNameComponent],
            providers: [
                { provide: VirtualPlayerNameService, useValue: virtualPlayerNameServiceSpyObj },
                { provide: DictionaryService, useValue: dictionaryService },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: Router, useValue: routerSpyObj },
            ],
            imports: [MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        virtualPlayerNameServiceSpyObj.getAdvancedList();
        fixture = TestBed.createComponent(VirtualPlayerNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
