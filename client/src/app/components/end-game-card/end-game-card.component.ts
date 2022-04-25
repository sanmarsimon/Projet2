import { Component, Inject } from '@angular/core';
import { GameMasterService } from '@app/services/game-master.service';

@Component({
    selector: 'app-end-game-card',
    templateUrl: './end-game-card.component.html',
    styleUrls: ['./end-game-card.component.scss'],
})
export class EndGameCardComponent {
    constructor(@Inject(GameMasterService) public gameMasterService: GameMasterService) {}
}
