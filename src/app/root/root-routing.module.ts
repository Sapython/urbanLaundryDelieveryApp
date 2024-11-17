import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RootPage } from './root.page';

const routes: Routes = [
  {
    path: '',
    component: RootPage,
    children:[
      {
        path: 'order-details',
        loadChildren: () => import('./order-details/order-details.module').then( m => m.OrderDetailsPageModule)
      },
      {
        path: 'clothes/:mode',
        loadChildren: () => import('./clothes/clothes.module').then( m => m.ClothesPageModule)
      },
      {
        path: 'delivery-otp',
        loadChildren: () => import('./delivery-otp/delivery-otp.module').then( m => m.DeliveryOtpPageModule)
      },
      {
        path: 'confirm',
        loadChildren: () => import('./confirm/confirm.module').then( m => m.ConfirmPageModule)
      },
      {
        path: 'verify-otp',
        loadChildren: () => import('./verify-otp/verify-otp.module').then( m => m.VerifyOtpPageModule)
      },
      {
        path: 'pickup',
        loadChildren: () => import('./pickup/pickup.module').then( m => m.PickupPageModule)
      },
      {
        path: 'delivery',
        loadChildren: () => import('./delivery/delivery.module').then( m => m.DeliveryPageModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'upi',
        loadChildren: () => import('./upi/upi.module').then( m => m.UpiPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RootPageRoutingModule {}
