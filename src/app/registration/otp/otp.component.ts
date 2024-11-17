import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { UserService } from 'src/services/User/user.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  public otpForm: FormGroup = new FormGroup({
    otpVerify: new FormControl(),
  });
  constructor(
    private dataProvider: DataProviderService,
    private router: Router,
    private user: UserService
  ) {}

  ngOnInit() {}

  otpVerify() {
    console.log(
      this.dataProvider.phoneData.confirm(this.otpForm.value.otpVerify)
    );
    this.dataProvider.phoneData
      .confirm(this.otpForm.value.otpVerify)
      .then((res:any) => {
        console.log(res);
        const data = {
          ...this.dataProvider.user,
          phoneVerify: true,
        };
        this.user.updateUser(this.dataProvider.user?.id || '', data);
        this.router.navigateByUrl('/terms-condition');
      })
      .catch((err:any) => {
        console.log(err);
      });
  }

}
