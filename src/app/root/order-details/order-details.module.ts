
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDetailsPageRoutingModule } from './order-details-routing.module';

import { OrderDetailsPage } from './order-details.page';
import { CompletedComponent } from './completed/completed.component';
import { RequestComponent } from './request/request.component';
import { CancelComponent } from './cancel/cancel.component';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
// import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsModule,
    OrderDetailsPageRoutingModule,
  ],
  declarations: [
    OrderDetailsPage,
    CompletedComponent,
    RequestComponent,
    // HeaderComponent,
    CancelComponent
  ]
})
export class OrderDetailsPageModule {}
