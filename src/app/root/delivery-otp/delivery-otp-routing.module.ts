import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryOtpPage } from './delivery-otp.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryOtpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryOtpPageRoutingModule {}
