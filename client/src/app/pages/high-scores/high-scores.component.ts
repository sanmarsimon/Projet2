import { Component, Inject, OnInit } from '@angular/core';
import { Standings } from '@app/classes/standings';
import { MultiplayerService } from '@app/services/multiplayer.service';

@Component({
    selector: 'app-high-scores',
    templateUrl: './high-scores.component.html',
    styleUrls: ['./high-scores.component.scss'],
})
export class HighScoresComponent implements OnInit {
    listOfScores: Standings[] = [];
    constructor(@Inject(MultiplayerService) private multiplayerService: MultiplayerService) {}
    ngOnInit(): void {
        this.addValueToStandings();
    }
    async addValueToStandings() {
        // eslint-disable-next-line no-console
        console.log('entre first step');
        this.multiplayerService.showScore();
        this.multiplayerService.listenShowScores('showScore').subscribe((data) => {
            for (const highscore of data) {
                this.listOfScores.push({ name: highscore.name, score: highscore.score });
                // console.log(highscore.name);
            }
        });
    }
}
