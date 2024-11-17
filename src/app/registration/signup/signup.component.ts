import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth/auth.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]), 
    username: new FormControl('', [Validators.required]),
  });

  constructor(
    public authservice: AuthService,
    private alertify: AlertsAndNotificationsService,
    private router: Router,
    private dataProvider:DataProviderService,
    public auth: AuthService
  ) {}

  ngOnInit() {}

  signUpWithEmailAndPassword() {
    if (this.signupForm.valid) {
      this.dataProvider.signUp = this.signupForm.value;
      this.dataProvider.loading = true;
      this.authservice.signUpWithEmailAndPassword(this.signupForm.value).then((res)=>{
        console.log(this.dataProvider.signUp);
        this.signupForm.reset();
      })
    }
  }
}
