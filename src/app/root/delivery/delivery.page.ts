import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/services/Database/database.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { Bookings } from 'src/structures/bookings.structure';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit, OnDestroy {
  jobListSubscription:Subscription = Subscription.EMPTY;
  pickupJobs:any[] = [];
  quantity:number = 0;
  constructor(private route: Router, private dBService: DatabaseService, private dataProvider: DataProviderService) { }
  ngOnDestroy():void {
    this.jobListSubscription.unsubscribe();
  }

  ngOnInit() {
    this.jobListSubscription = this.dBService.getDeliveryJobs().subscribe((res:any)=>{
      this.pickupJobs = res.map((doc:any,index:number)=>{return {...doc,index:index}});
      console.log(this.pickupJobs);
      
      res.forEach((item:any)=>{
        this.quantity = item.activeClothes.reduce((total:number, item:any )=>{
          return total + item.quantity;
        },0)
      })
      console.log(this.quantity);
    })
  }

  sortPickupJobs(){
    // on the basis of index
    this.pickupJobs.sort((a:any,b:any)=>{
      return b.index - a.index;
    })
    console.log(this.pickupJobs);
  }

  // "../order-details/request"
  navigateToDetail(booking:Bookings){
    this.dataProvider.currentPickup = booking;
    this.dataProvider.currentPickupId = booking.id; 
    console.log(this.dataProvider.currentPickupId, this.dataProvider.currentPickup);
    this.dataProvider.mode = 'delivery';
    this.route.navigateByUrl('root/order-details/request')
  }

  moveToOtp(booking:any){
    this.dataProvider.currentBooking = booking;
    this.route.navigate(["/delivery-otp"])

  }



  deliveryApprove(delivery: Bookings, status: any,event:any) {
    event.stopPropagation();
    if(status == 'ignore'){
      this.pickupJobs.find((job:any) => job.id == delivery).index = -1;
      this.sortPickupJobs();
    } else if (status == 'accept') {
      this.dataProvider.currentPickup = delivery;
      this.dataProvider.currentPickupId = delivery.id;
      this.dataProvider.mode = 'delivery'
      this.route.navigateByUrl('root/verify-otp')
    }
  }


}

export interface ExtendedBookings extends Bookings{
  id:string;
}