import { Component, Inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LOG2990_RULES, SINGLE_PLAYER_MODE, WAIT_1_SEC } from '@app/constant';
import { GameMasterService } from '@app/services/game-master.service';
import { LettersStockService } from '@app/services/letters-stock.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    letterInBank: number;
    isSinglePlayer: boolean;
    showObjectives = false;
    constructor(
        @Inject(MatProgressBarModule) public matProgressBarModule: MatProgressBarModule,
        @Inject(LettersStockService) public letterBank: LettersStockService,
        @Inject(GameMasterService) public gameMaster: GameMasterService,
        @Inject(MultiplayerService) private multiplayer: MultiplayerService,
        public playerService: PlayerService,
        public virtualPlayer: VirtualPlayerService,
    ) {
        this.showObjectives = this.gameMaster.gameRules === LOG2990_RULES;
        this.isSinglePlayer = this.gameMaster.getGameMode() === SINGLE_PLAYER_MODE;
        this.verifyGameMode();
    }
    async verifyGameMode() {
        this.multiplayer.listenTunnel('opponentQuit').subscribe(() => {
            setTimeout(() => {
                this.isSinglePlayer = this.gameMaster.getGameMode() === SINGLE_PLAYER_MODE;
            }, WAIT_1_SEC);
        });
    }
}
