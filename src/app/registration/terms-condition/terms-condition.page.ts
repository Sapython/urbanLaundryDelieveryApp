import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';

import { UserService } from 'src/services/User/user.service';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.page.html',
  styleUrls: ['./terms-condition.page.scss'],
})
export class TermsConditionPage implements OnInit {

  checked:boolean= true
  constructor(public auth:AuthService, public dataProvider:DataProviderService, private router:Router, private user:UserService) { }

  ngOnInit() {
  }

  triggerCheckBox(){
    this.checked = !this.checked;
    console.log(this.checked) 
  }

  signUp(){
    console.log("triigerd")
    
      const data = {
        ...this.dataProvider.user,
        termsCondition:true
      }
      this.user.updateUser(this.dataProvider.user?.id || '', data)
      this.router.navigateByUrl('/job/job-listing') 
    }
     
  }


