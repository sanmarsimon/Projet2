/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryService } from '@app/services/dictionary.service';
import { NewDictionaryComponent } from './new-dictionary.component';

describe('NewDictionaryComponent', () => {
    let component: NewDictionaryComponent;
    let fixture: ComponentFixture<NewDictionaryComponent>;
    let dictionaryService: jasmine.SpyObj<DictionaryService>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;
    beforeEach(async () => {
        dictionaryService = jasmine.createSpyObj('DictionaryService', ['create', 'readFile']);
        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            declarations: [NewDictionaryComponent],
            providers: [
                { provide: DictionaryService, useValue: dictionaryService },
                { provide: Router, useValue: routerSpyObj },
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
            imports: [MatDialogModule, ReactiveFormsModule, FormsModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDictionaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should reset', () => {
        component.reset();
        expect(component.myInputVariable.nativeElement.value).toBe('');
        // // spy.endresolve
        // setTimeout(() => {
        //     expect();
        //     done();
        // }, 100);
    });
    it('should return valid when onChange is called', (done) => {
        dictionaryService.readFile.and.resolveTo(true);
        component.onChange(new Event('test'));
        setTimeout(() => {
            expect(component.nameAndFormatValid).toBeTrue();
            done();
        }, 100);
    });

    // it('should onSubmit', () => {
    //     component.onSubmit();
    //     expect(component.myInputVariable.nativeElement.value).toBe('');
    // });
});
