import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';

import {BoardComponent} from './board/board.component';
import {GameTileComponent} from './game-tile/game-tile.component';
import {OutcomeFeedComponent} from './outcome-feed/outcome-feed.component';
import {PieceTrayComponent} from './piece-tray/piece-tray.component';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {TeamPickerComponent} from './team-picker/team-picker.component';

@NgModule({
  declarations: [
    BoardComponent,
    ScoreboardComponent,
    TeamPickerComponent,
    GameTileComponent,
    PieceTrayComponent,
    OutcomeFeedComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    BoardComponent,
    ScoreboardComponent,
    TeamPickerComponent,
    GameTileComponent,
    PieceTrayComponent,
    OutcomeFeedComponent,
  ]
})
export class ComponentsModule {
}
