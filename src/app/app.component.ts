import { Component } from '@angular/core';
import {
  Platform,
  PopoverController,
} from '@ionic/angular';

import { Router } from '@angular/router';

import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Auth, authState, User } from '@angular/fire/auth';
import { EMPTY, Observable, Subject } from 'rxjs';
import { AuthService } from 'src/services/auth/auth.service';
import { DatabaseService } from 'src/services/Database/database.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { urls } from 'src/services/url';
import { notificationStructure } from '../structures/notification.structure';
import { NotificationPopOverComponent } from './notification-pop-over/notification-pop-over.component';
import { UserData } from 'src/structures/user.structure';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public readonly user: Observable<User | null> = EMPTY;

  public loggedInUserData: Subject<any> = new Subject();

  public userdata: any;
  constructor(
    private platform: Platform,
    public authService: AuthService,
    private router: Router,
    private auth: Auth,
    public dataProvider: DataProviderService,
    private fs: Firestore,
    private database: DatabaseService,
    private popOverController: PopoverController
  ) {
    this.database.getSettings().then((res) => {
      this.dataProvider.appSettings = res.data();
      console.log(this.dataProvider.appSettings);
    });
    this.user = authState(this.auth);
    this.router.navigate(['/loading']);
    this.user.subscribe({
      next:(user: any) => {
        if (user) {
          console.log(user.uid);
          this.dataProvider.LoggedInUser = true;
          this.loggedInUserData.next(user);
          const userUrl = urls.user.replace('{USER_ID}', user.uid);
          this.database.getNotifications(user.uid).subscribe((res: any) => {
            this.database.notifications = res;
            // alert('reacher2')
            this.database.notificationChanged.next(res);
            // alert('reacher3')
          });
          docData(doc(this.fs, userUrl)).subscribe((res) => {
            this.dataProvider.user = res as UserData;
            console.log(this.dataProvider.user);
            if (
              this.dataProvider.LoggedInUser == true
            ) {
              this.router.navigate(['root/pickup']);
            }
            let unReadNotifications: notificationStructure[] = [];
            let showBackDrop = true;
            this.database.notificationChanged.subscribe(async (res) => {
              var value: any = {};
              for (value of res) {
                console.log('value', value);
  
                if (value.viewed != true) {
                  const isUnRead = unReadNotifications.find((existingValue) => {
                    return existingValue.id == value.id;
                  });
                  console.log(value, unReadNotifications);
                  if (isUnRead == undefined) {
                    unReadNotifications.push(value);
                    const popOver = await this.popOverController.create({
                      component: NotificationPopOverComponent,
                      componentProps: value,
                      showBackdrop: showBackDrop,
                      cssClass: 'removeShadow',
                    });
                    popOver.present();
                    showBackDrop = false;
                  }
                }
              }
            });
          });
        } else {
          console.log('logged out');
          this.router.navigate(['registration/login']);
          this.dataProvider.LoggedInUser = false;
          this.dataProvider.user = undefined;
          this.loggedInUserData.next(false);
          return;
        }
      },
      error: (err) => {
        console.log("User Error",err);
      }
    });
  }

}
