import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChevaletComponent } from '@app/components/chevalet/chevalet.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { MultiplayerConfigPanelComponent } from '@app/pages/multiplayer-config-panel/multiplayer-config-panel.component';
import { DictionaryService } from '@app/services/dictionary.service';
import { PlayerService } from '@app/services/player.service';
import { CommunicationBoxComponent } from './components/communication-box/communication-box.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { DeletionConfirmationComponent } from './components/deletion-confirmation/deletion-confirmation.component';
import { EndGameCardComponent } from './components/end-game-card/end-game-card.component';
import { InfoPannelComponent } from './components/info-pannel/info-pannel.component';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';
import { OpponentCardComponent } from './components/opponent-card/opponent-card.component';
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { VirtualPlayerCardComponent } from './components/virtual-player-card/virtual-player-card.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DictionaryComponent } from './pages/dictionary/dictionary.component';
import { GameModeComponent } from './pages/game-mode/game-mode.component';
import { HighScoresComponent } from './pages/high-scores/high-scores.component';
import { InfoPlayerComponent } from './pages/info-player/info-player.component';
import { JoinRoomPanelComponent } from './pages/join-room-panel/join-room-panel.component';
import { ModifyDictionaryComponent } from './pages/modify-dictionary/modify-dictionary.component';
import { NewDictionaryComponent } from './pages/new-dictionary/new-dictionary.component';
import { QuitConfirmationComponent } from './pages/quit-confirmation/quit-confirmation.component';
import { VirtualPlayerNameDialogComponent } from './pages/virtual-player-name-dialog/virtual-player-name-dialog.component';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { SoloModeNotificationComponent } from './pages/solo-mode-notification/solo-mode-notification.component';
import { VirtualPlayerNameComponent } from './pages/virtual-player-name/virtual-player-name.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        CommunicationBoxComponent,
        ChevaletComponent,
        InfoPannelComponent,
        MenuButtonComponent,
        GameModeComponent,
        InfoPlayerComponent,
        PlayerCardComponent,
        VirtualPlayerCardComponent,
        EndGameCardComponent,
        MultiplayerConfigPanelComponent,
        JoinRoomPanelComponent,
        OpponentCardComponent,
        QuitConfirmationComponent,
        AdminComponent,
        DictionaryComponent,
        VirtualPlayerNameComponent,
        NewDictionaryComponent,
        ModifyDictionaryComponent,
        DeletionConfirmationComponent,
        ConfirmationDialogComponent,
        VirtualPlayerNameDialogComponent,
        SoloModeNotificationComponent,
        HighScoresComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, ReactiveFormsModule],
    providers: [PlayerService, DictionaryService, VirtualPlayerNameService],
    bootstrap: [AppComponent],
})
export class AppModule {}
