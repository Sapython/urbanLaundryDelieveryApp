import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss'],
})
export class CancelComponent implements OnInit {
  display: boolean = true;
  cancelSection: boolean = false
  constructor() { }

  ngOnInit() {}

  cancel(){
    this.display = false
    this.cancelSection = true
  }
}
