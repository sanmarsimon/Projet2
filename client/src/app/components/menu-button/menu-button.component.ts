import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuitConfirmationComponent } from '@app/pages/quit-confirmation/quit-confirmation.component';
import { GameMasterService } from '@app/services/game-master.service';

@Component({
    selector: 'app-menu-button',
    templateUrl: './menu-button.component.html',
    styleUrls: ['./menu-button.component.scss'],
})
export class MenuButtonComponent {
    constructor(@Inject(GameMasterService) public gameMasterService: GameMasterService, public dialog: MatDialog) {}

    openConfirmationBox() {
        this.dialog.open(QuitConfirmationComponent);
    }
}
