import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ComponentsModule} from 'src/app/components/components.module';

import {AllPageRoutingModule} from './all-routing.module';
import {AllPage} from './all.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [AllPage]
})
export class AllPageModule {
}
