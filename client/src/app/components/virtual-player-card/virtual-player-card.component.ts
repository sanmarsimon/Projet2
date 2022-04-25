import { Component, Inject } from '@angular/core';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { GameMasterService } from '@app/services/game-master.service';

@Component({
    selector: 'app-virtual-player-card',
    templateUrl: './virtual-player-card.component.html',
    styleUrls: ['./virtual-player-card.component.scss'],
})
export class VirtualPlayerCardComponent {
    constructor(
        @Inject(VirtualPlayerService) public virtualPlayerService: VirtualPlayerService,
        @Inject(GameMasterService) public gameMasterService: GameMasterService,
    ) {}
}
