import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/services/Database/database.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { UserService } from 'src/services/User/user.service';
import { Bookings } from 'src/structures/bookings.structure';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.page.html',
  styleUrls: ['./pickup.page.scss'],
})
export class PickupPage implements OnDestroy {
  jobListSubscription: Subscription = Subscription.EMPTY;
  pickupJobs: any[] = []
  bookingStatuses = [
    'pending',
    'pickupAssigned',
    'pickupStarted',
    'pickupReceived',
    'pickupCompleted',
    'washInProgress',
    'washCompleted',
    'deliveryAssigned',
    'outForDelivery',
    'deliveryCompleted' ,
    'cancelled',
    ]
  constructor(private router: Router, private dBService: DatabaseService, private user: UserService, public dataProvider: DataProviderService) { }
  ngOnDestroy(): void {
    this.jobListSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.pickup();
  }


  pickup() {
    this.jobListSubscription = this.dBService.getPickupJobs().subscribe((res) => {
      // console.log("my console value", res);
      this.pickupJobs = res.map((doc,index) => {return {...doc,index:index}});
      console.log(this.pickupJobs , 'new')
      this.sortPickupJobs();
    })
  }

  sortPickupJobs(){
    // on the basis of index
    this.pickupJobs.sort((a,b) => {
      return b.index - a.index;
    })
    console.log(this.pickupJobs , 'new');
  }

  pickupApprove(id: any, status: any,event:any) {
    event.stopPropagation();
    if(status == 'ignore'){
      this.pickupJobs.find((job) => job.id == id).index = -1;
      console.log("Found this",this.pickupJobs.find((job) => job.id == id));
      this.sortPickupJobs();
    }
  }

  verifyOtp(pickup: Bookings,event:any) {
    event.stopPropagation();
    this.dataProvider.currentPickup = pickup;
    this.dataProvider.currentPickupId = pickup.id;
    this.dataProvider.mode = 'pickup';
    this.router.navigateByUrl('root/verify-otp');
  }

  navigateToDetail(booking:Bookings){
    this.dataProvider.currentPickup = booking;
    this.dataProvider.currentPickupId = booking.id; 
    console.log(this.dataProvider.currentPickupId, this.dataProvider.currentPickup);
    this.dataProvider.mode = 'pickup';
    this.router.navigateByUrl('root/order-details/request')
  }

  breakWordOnCase(text:string){
    return text.replace(/([A-Z])/g, ' $1').trim();
  }

}