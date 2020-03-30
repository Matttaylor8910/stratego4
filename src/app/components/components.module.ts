import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';

import {BoardComponent} from './board/board.component';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {TeamPickerComponent} from './team-picker/team-picker.component';
import {TileComponent} from './tile/tile.component';
import {GameTileComponent} from './game-tile/game-tile.component';

@NgModule({
  declarations: [
    BoardComponent,
    ScoreboardComponent,
    TileComponent,
    TeamPickerComponent,
    GameTileComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    BoardComponent,
    ScoreboardComponent,
    TileComponent,
    TeamPickerComponent,
    GameTileComponent
  ]
})
export class ComponentsModule {
}
