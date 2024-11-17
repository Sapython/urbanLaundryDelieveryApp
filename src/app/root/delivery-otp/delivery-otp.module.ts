import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryOtpPageRoutingModule } from './delivery-otp-routing.module';

import { DeliveryOtpPage } from './delivery-otp.page';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryOtpPageRoutingModule,
    NgOtpInputModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [DeliveryOtpPage]
})
export class DeliveryOtpPageModule {}
