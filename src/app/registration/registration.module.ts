import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { PhoneComponent } from './phone/phone.component';
import { SignupComponent } from './signup/signup.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationPageRoutingModule,
    ReactiveFormsModule,
    NgOtpInputModule
  ],
  declarations: [
    RegistrationPage,
    LoginComponent,
    OtpComponent,
    PhoneComponent,
    SignupComponent,
    ForgotComponent,
    ResetComponent
  ]
})
export class RegistrationPageModule {}
