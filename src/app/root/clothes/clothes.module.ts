import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClothesPageRoutingModule } from './clothes-routing.module';

import { ClothesPage } from './clothes.page';
import { ComponentModule } from '../../Components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClothesPageRoutingModule,
    ComponentModule
  ],
  declarations: [ClothesPage]
})
export class ClothesPageModule {}
