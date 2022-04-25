/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { DictionaryService } from '@app/services/dictionary.service';
import { DictionaryComponent } from './dictionary.component';

describe('DictionaryComponent', () => {
    let component: DictionaryComponent;
    let fixture: ComponentFixture<DictionaryComponent>;
    let dictionaryService: jasmine.SpyObj<DictionaryService>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;
    let matDialogRefSpyObj: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;
    let routeStub;
    beforeEach(async () => {
        dictionaryService = jasmine.createSpyObj('DictionaryService', ['getList', 'download']);
        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogRefSpyObj = jasmine.createSpyObj('MatDialog', ['']);
        routeStub = {
            data: null,
        };
        await TestBed.configureTestingModule({
            declarations: [DictionaryComponent],
            providers: [
                { provide: DictionaryService, useValue: dictionaryService },
                { provide: Router, useValue: routerSpyObj },
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: MatDialogRef, useValue: matDialogRefSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: ActivatedRoute, useValue: routeStub },
            ],
            imports: [MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictionaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (done) => {
        // dictionaryService.getList.and.resolveTo(true);
        // component.ngOnInit();
        // setTimeout(() => {
        //     console.log('hey');
        //     console.log(dictionaryService);
        //     expect(component.serverNotFound).toBeFalse();
        //     expect(routerSpyObj.navigate).toHaveBeenCalled();
        //     done();
        // }, 100);
        dictionaryService.getList.calls.mostRecent().returnValue.then(() => {
            expect(component.serverNotFound).toBeFalse();
            expect(routerSpyObj.navigate).toHaveBeenCalled();
        });
        expect(component).toBeTruthy();
        done();
    });

    // it('should ngOnInit', (done) => {
    //     dictionaryService.getList.and.resolveTo(true);
    //     component.ngOnInit();
    //     setTimeout(() => {
    //         console.log('hey');
    //         expect(component.serverNotFound).toBeFalse();
    //         console.log('hey');
    //         expect(routerSpyObj.navigate).toHaveBeenCalled();
    //         console.log('hey');
    //         done();
    //     }, 100);
    // });

    // it('should modify in the admin page', () => {
    //     component.onModify(5);
    //     expect(routerSpyObj.navigate).toHaveBeenCalled();
    // });

    // it('should delete when we open the browser', () => {
    //     component.onDelete(5);
    //     expect(matDialogSpyObj.open).toHaveBeenCalled();
    //     expect(dictionaryService.deletionIndex).toEqual(5);
    // });

    // it('should get the index from dict ', () => {
    //     dictionaryService.dictList = [
    //         {
    //             title: 'Mon dictionnaire',
    //             description: 'kajhss',
    //             words: ['ass', 'aks'],
    //         },
    //     ];
    //     spyOnProperty(component, 'defaultDictIndex').and.callThrough();
    //     expect(component.defaultDictIndex).toBe(0);
    // });

    // it('should get the index from dict ', () => {
    //     dictionaryService.dictList = [
    //         {
    //             title: 'pas de dict',
    //             description: 'kajhss',
    //             words: ['ass', 'aks'],
    //         },
    //     ];
    //     spyOnProperty(component, 'defaultDictIndex').and.callThrough();
    //     expect(component.defaultDictIndex).toEqual(-1);
    // });

    // it('should get the index from dict ', () => {
    //     dictionaryService.dictList = [
    //         {
    //             title: 'pas de dict',
    //             description: 'kajhss',
    //             words: ['ass', 'aks'],
    //         },
    //     ];
    //     spyOnProperty(component, 'defaultDictIndex').and.callThrough();
    //     expect(component.defaultDictIndex).toEqual(-1);
    // });
});
