import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { GameMasterService } from '@app/services/game-master.service';
import { MultiplayerService } from '@app/services/multiplayer.service';
import { PlayerService } from '@app/services/player.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-opponent-card',
    templateUrl: './opponent-card.component.html',
    styleUrls: ['./opponent-card.component.scss'],
})
export class OpponentCardComponent implements OnInit, OnDestroy {
    letterLength: string = '7';
    letterLengthSubscription: Subscription;
    constructor(
        @Inject(PlayerService) public playerService: PlayerService,
        @Inject(GameMasterService) public gameMasterService: GameMasterService,
        @Inject(MultiplayerService) public multiplayerService: MultiplayerService,
    ) {}
    ngOnDestroy(): void {
        this.letterLengthSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.listenLetterLength();
    }

    listenLetterLength() {
        this.letterLengthSubscription = this.multiplayerService.listenTunnel('broadcastLetterLength').subscribe((letterLength) => {
            this.letterLength = letterLength;
        });
    }
}
