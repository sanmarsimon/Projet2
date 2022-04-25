import { Component, Inject } from '@angular/core';
import { GameMasterService } from '@app/services/game-master.service';
import { PlayerService } from '@app/services/player.service';
@Component({
    selector: 'app-player-card',
    templateUrl: './player-card.component.html',
    styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent {
    constructor(@Inject(PlayerService) public playerService: PlayerService, @Inject(GameMasterService) public gameMasterService: GameMasterService) {}
}
