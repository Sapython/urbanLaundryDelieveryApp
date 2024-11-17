import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}


  pickup(){
    this.router.navigateByUrl('/job/job-list')
  }
  delivery(){
    this.router.navigateByUrl('/job/delivery')
  }
  history(){
    this.router.navigateByUrl('/job/history')
  }
  profile(){
    this.router.navigateByUrl('/job/profile')
  }
}
