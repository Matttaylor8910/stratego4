import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {BoardComponent} from './board/board.component';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {TileComponent} from './tile/tile.component';

@NgModule({
  declarations: [
    BoardComponent,
    ScoreboardComponent,
    TileComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    BoardComponent,
    ScoreboardComponent,
    TileComponent,
  ]
})
export class ComponentsModule {
}
