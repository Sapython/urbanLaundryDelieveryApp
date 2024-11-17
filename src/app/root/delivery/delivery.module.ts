import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryPageRoutingModule } from './delivery-routing.module';

import { DeliveryPage } from './delivery.page';
import { ComponentModule } from 'src/app/Components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentModule,
    DeliveryPageRoutingModule
  ],
  declarations: [DeliveryPage]
})
export class DeliveryPageModule {}
