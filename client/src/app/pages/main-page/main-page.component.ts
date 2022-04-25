import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '@app/classes/message';
import { CLASSIC_RULES, LOG2990_RULES } from '@app/constant';
import { GameModeComponent } from '@app/pages/game-mode/game-mode.component';
import { HighScoresComponent } from '@app/pages/high-scores/high-scores.component';
import { CommunicationService } from '@app/services/communication.service';
import { GameMasterService } from '@app/services/game-master.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(private readonly communicationService: CommunicationService, private gameMaster: GameMasterService, public dialog: MatDialog) {}
    openDialog() {
        this.dialog.open(GameModeComponent);
    }
    setLOG2990(): void {
        this.gameMaster.gameRules = LOG2990_RULES;
        this.openDialog();
    }
    setClassicRules(): void {
        this.gameMaster.gameRules = CLASSIC_RULES;
        this.openDialog();
    }
    sendTimeToServer(): void {
        const newTimeMessage: Message = {
            title: 'Hello from the client',
            body: 'Time is : ' + new Date().toString(),
        };
        this.communicationService.basicPost(newTimeMessage).subscribe();
    }
    openDialogHighScores() {
        this.dialog.open(HighScoresComponent);
        // ref.componentInstance.addValueToStandings();
    }
    getMessagesFromServer(): void {
        this.communicationService
            .basicGet()
            // Cette étape transforme l'objet Message en un seul string
            .pipe(
                map((message: Message) => {
                    return `${message.title} ${message.body}`;
                }),
            )
            .subscribe(this.message);
    }
}
