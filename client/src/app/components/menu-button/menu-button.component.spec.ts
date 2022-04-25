import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { QuitConfirmationComponent } from '@app/pages/quit-confirmation/quit-confirmation.component';
import { GameMasterService } from '@app/services/game-master.service';
import { MenuButtonComponent } from './menu-button.component';
describe('MenuButtonComponent', () => {
    let component: MenuButtonComponent;
    let fixture: ComponentFixture<MenuButtonComponent>;
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;
    let gameMasterServiceSpy: jasmine.SpyObj<GameMasterService>;

    beforeEach(async () => {
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        gameMasterServiceSpy = jasmine.createSpyObj('GameMasterService', ['']);

        await TestBed.configureTestingModule({
            declarations: [MenuButtonComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpyObj },
                { provide: GameMasterService, useValue: gameMasterServiceSpy },
            ],
            imports: [AppMaterialModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should openConfirmationBox', () => {
        component.openConfirmationBox();
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(QuitConfirmationComponent);
    });
});
