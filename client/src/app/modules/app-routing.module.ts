import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { AdminComponent } from '@app/pages/admin/admin.component';
import { DictionaryComponent } from '@app/pages/dictionary/dictionary.component';
import { VirtualPlayerNameComponent } from '@app/pages/virtual-player-name/virtual-player-name.component';
import { NewDictionaryComponent } from '@app/pages/new-dictionary/new-dictionary.component';
import { ModifyDictionaryComponent } from '@app/pages/modify-dictionary/modify-dictionary.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'admin/dictionary-list', component: DictionaryComponent },
    { path: 'admin/add-dict', component: NewDictionaryComponent },
    { path: 'admin/modify-dict/:id', component: ModifyDictionaryComponent },
    { path: 'admin/virtual-player-name', component: VirtualPlayerNameComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
