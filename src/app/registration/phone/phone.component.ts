import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { UserService } from 'src/services/User/user.service';


@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
})
export class PhoneComponent implements OnInit {

  public phoneLoginForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl(), 
  });
  constructor(private auth:AuthService, private router:Router, private dataProvider:DataProviderService, private user:UserService,private alertify:AlertsAndNotificationsService) { }

  ngOnInit() {
  }

  loginInWithPhoneNumber(){
    console.log(this.phoneLoginForm.value.phoneNumber)
    const data = {
      ...this.dataProvider.user,
      phone:this.phoneLoginForm.value.phoneNumber,
      phoneVerify:false
    }
    this.user.updateUser(this.dataProvider.user?.id || '', data)
    this.auth.signInWithPhoneNumber(this.phoneLoginForm.value.phoneNumber).then((res)=>{
      this.dataProvider.phoneData = res;
      this.router.navigateByUrl('/registration/otp');
    }).catch((err)=>{
      this.alertify.presentToast(err.message)      
    })
  }


}
