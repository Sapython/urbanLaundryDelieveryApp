import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/services/Database/database.service';
import { Bookings } from 'src/structures/bookings.structure';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage {
  pickupJobs: Bookings[] = [];
  filteredPickupJobs: Bookings[] = [];
  filtersEnabled: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();
  constructor(private route: Router, private dBService: DatabaseService) { }

  ionViewWillEnter() {
    this.pickupJobs = []
    this.dBService.getHistory().then((res) => {
      console.log(res);
      this.pickupJobs = [...this.pickupJobs,...res.docs.map((doc) => {return {...doc.data(), id: doc.id} as Bookings})];
    })
  }

  handleRefresh(event:any){
    this.pickupJobs = []
    this.dBService.getHistory().then((res) => {
      console.log(res);
      this.pickupJobs = [...this.pickupJobs,...res.docs.map((doc) => {return {...doc.data(), id: doc.id} as Bookings})];
    }).finally(() => {
      event.target.complete();
    })
  }

  filterHistory(event:any, type: 'start'|'end'){
    this.filtersEnabled = true;
    if(type == 'start'){
      console.log(event);
      this.startDate = event.target.valueAsDate
    }else{
      this.endDate = event.target.valueAsDate
    }
    console.log(this.startDate, this.endDate);
    if(this.startDate && this.endDate){
      this.filteredPickupJobs = this.pickupJobs.filter((job) => {
        let date = job['createdAt'] as Timestamp
        return date.toDate().getTime() >= this.startDate.getTime() && date.toDate().getTime() <= this.endDate.getTime()
      })
    }
  }
}
