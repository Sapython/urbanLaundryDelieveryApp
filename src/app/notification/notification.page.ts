import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notClear: boolean = true;
  clear:boolean = false;
  constructor() { }

  ngOnInit() {
  }

  clearAll(){
    this.notClear = false;
    this.clear = true
  }
}
