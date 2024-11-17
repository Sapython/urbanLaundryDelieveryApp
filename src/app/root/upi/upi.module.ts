import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpiPageRoutingModule } from './upi-routing.module';

import { UpiPage } from './upi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpiPageRoutingModule
  ],
  declarations: [UpiPage]
})
export class UpiPageModule {}
