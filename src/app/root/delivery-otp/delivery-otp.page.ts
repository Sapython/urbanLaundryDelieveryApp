import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/services/Database/database.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';


@Component({
  selector: 'app-delivery-otp',
  templateUrl: './delivery-otp.page.html',
  styleUrls: ['./delivery-otp.page.scss'],
})
export class DeliveryOtpPage {

  otp: any;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;

  constructor(
    private dBService: DatabaseService, 
    private route: Router, 
    private alertify : AlertsAndNotificationsService,
    private dataProvider: DataProviderService
    ) { }

  otpForm:FormGroup = new FormGroup({
    otp1 : new FormControl('',[Validators.required]),
    otp2 : new FormControl('',[Validators.required]),
    otp3 : new FormControl('',[Validators.required]),
    otp4 : new FormControl('',[Validators.required]),
    otp5 : new FormControl('',[Validators.required]),
    otp6 : new FormControl('',[Validators.required]),
  })


  submit(){
    let otp = Object.values(this.otpForm.value).join('');
    console.log(Object.values(this.otpForm.value).join(''));
    
    if(otp == this.otp){
      this.route.navigate(["/clothes"]);
      this.otpForm.reset()
    }else{
      this.alertify.presentToast("Wrong OTP entered", "error");
    }
  }

  ionViewWillEnter(){
    this.otp = this.dataProvider.currentBooking!.otp.toString()
    
  }
}
