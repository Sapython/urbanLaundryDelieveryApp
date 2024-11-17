import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { PhoneComponent } from './phone/phone.component';

import { RegistrationPage } from './registration.page';
import { ResetComponent } from './reset/reset.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationPage
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'otp',
    component: OtpComponent
  },
  {
    path: 'phone',
    component: PhoneComponent
  },
  {
    path: 'forgot',
    component: ForgotComponent
  },
  {
    path: 'reset',
    component: ResetComponent
  },
  {
    path: 'terms-condition',
    loadChildren: () =>
      import('./terms-condition/terms-condition.module').then(
        (m) => m.TermsConditionPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationPageRoutingModule {}
