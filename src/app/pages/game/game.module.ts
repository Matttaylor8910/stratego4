import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ComponentsModule} from 'src/app/components/components.module';

import {GamePageRoutingModule} from './game-routing.module';
import {GamePage} from './game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule,
    ComponentsModule,
  ],
  declarations: [
    GamePage,
  ]
})
export class GamePageModule {
}
