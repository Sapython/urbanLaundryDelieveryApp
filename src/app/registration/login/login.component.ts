import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
  });

  constructor(public auth: AuthService, private router:Router,private alertify:AlertsAndNotificationsService,private dataProvider:DataProviderService) { }

  ngOnInit() { }

  loginWithEmail() {
    if(this.loginForm.valid){
      this.dataProvider.loading = true;
      this.auth.loginWithEmailPassword(this.loginForm.value.email, this.loginForm.value.password).then((res)=>{
        this.alertify.presentToast('Login Successful')
        this.loginForm.reset()
      }).catch((err)=>{
        this.alertify.presentToast(err.message,'error')
      }).finally(()=>{
        this.dataProvider.loading = false;
      })
    } else {
      alert('Invalid Login Credentials')
    }
  }

  loginWithGoogle(){
    this.auth.signUpWithGoogle().then((res)=>{
      this.router.navigateByUrl('/registration/phone')
    })
  }

}

