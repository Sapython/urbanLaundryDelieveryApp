import { Component, OnInit } from '@angular/core';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage {
  confirmation:boolean = true;
  confirmed:boolean = false;
  constructor(public dataProvider:DataProviderService) { }

  ionViewWillEnter() {
    this.waiting();
  }

  waiting(){
    setTimeout(()=>{
      this.confirmation = false;
      this.confirmed = true;
    }, 1000)
  }
}
