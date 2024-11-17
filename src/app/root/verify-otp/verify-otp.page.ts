import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/services/Database/database.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { Bookings } from 'src/structures/bookings.structure';


@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
})
export class VerifyOtpPage implements OnInit {
  isServiceActive: boolean = false;
  public otpVerifyForm: FormGroup = new FormGroup({
    otp: new FormControl(''),
  });
  constructor(public dataProvider:DataProviderService, public database:DatabaseService, private router:Router, private alertify: AlertsAndNotificationsService,  ) { }

  ngOnInit() {
  }

  verifyBooking(){
    console.log(this.otpVerifyForm.value)
    if(this.dataProvider.currentPickup && this.dataProvider.currentPickup.otp == this.otpVerifyForm.value.otp){
      if (['pickupAssigned','pickupStarted'].includes(this.dataProvider.currentPickup.stage.stage)) {
        this.database.updateBooking(this.dataProvider.currentPickup.id, {stage: {
          stage:'pickupStarted',
          message: 'Pickup Started',
          log:[{
            stage:'pickupStarted',
            date: Timestamp.fromDate(new Date()),
            userId: this.dataProvider.user?.id || '',
            message:'Pickup Started'
          },...(this.dataProvider.currentPickup.stage.log || [])]
        }})
        this.alertify.presentToast("OTP Accepted");
        this.router.navigateByUrl('root/clothes/add')
      } else if (['deliveryAssigned','outForDelivery'].includes(this.dataProvider.currentPickup.stage.stage)) {
        var data =  {stage: {
          stage:'outForDelivery',
          message: 'Delivery Started',
          log:[{
            stage:'outForDelivery',
            date: Timestamp.fromDate(new Date()),
            userId: this.dataProvider.user?.id || '',
            message:'Delivery Started'
          },...(this.dataProvider.currentPickup.stage.log || [])]
        }}
        this.database.updateBooking(this.dataProvider.currentPickup.id,data)
        // update currentPickup
        this.dataProvider.currentPickup = {...this.dataProvider.currentPickup, ...data} as Bookings
        this.alertify.presentToast("OTP Accepted");
        this.router.navigateByUrl('root/clothes/view')
      } else {
        this.alertify.presentToast("Not allowed path. Please contact admin");
      }
    }
    if(this.dataProvider.currentPickup && this.dataProvider.currentPickup.otp != this.otpVerifyForm.value.otp){
      this.alertify.presentToast("Wrong OTP , Please try Again");
    }
    this.otpVerifyForm.reset();
  }
}
