import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClothesPage } from './clothes.page';

const routes: Routes = [
  {
    path: '',
    component: ClothesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClothesPageRoutingModule {}
