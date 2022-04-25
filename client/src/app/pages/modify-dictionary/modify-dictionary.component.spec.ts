/* eslint-disable prettier/prettier */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DictionaryService } from '@app/services/dictionary.service';
import { ModifyDictionaryComponent } from './modify-dictionary.component';


describe('ModifyDictionaryComponent', () => {
  let component: ModifyDictionaryComponent;
  let fixture: ComponentFixture<ModifyDictionaryComponent>;
  let routerSpyObj: jasmine.SpyObj<Router>;
  let dictionaryService: jasmine.SpyObj<DictionaryService>;
  let matDialogSpyObj: jasmine.SpyObj<MatDialog>;

  let route;

  beforeEach(async () => {
    // component=new ModifyDictionaryComponent(route,dictionaryService,routerSpyObj,)
    route = {
      data: null
    };
    routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    dictionaryService = jasmine.createSpyObj('DictionaryService', ['modify', 'nameValidation']);
    matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ModifyDictionaryComponent],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: DictionaryService, useValue: dictionaryService },
        { provide: MatDialog, useValue: matDialogSpyObj },
        { provide: ActivatedRoute, useValue: route }
      ],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],

    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
