import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancelComponent } from './cancel/cancel.component';
import { CompletedComponent } from './completed/completed.component';

import { OrderDetailsPage } from './order-details.page';
import { RequestComponent } from './request/request.component';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailsPage
    // component: RequestComponent
  },
  {
    path: 'completed',
    component: CompletedComponent
  },
  {
    path: 'request',
    component: RequestComponent
  },
  {
    path: 'cancel',
    component: CancelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderDetailsPageRoutingModule {}
