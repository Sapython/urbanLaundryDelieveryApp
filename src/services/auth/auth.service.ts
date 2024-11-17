import { Injectable } from '@angular/core';

import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  linkWithPhoneNumber,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { urls } from '../url';

import { AlertsAndNotificationsService } from '../uiService/alerts-and-notifications.service';
import { Platform } from '@ionic/angular';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "@angular/fire/auth";
import { EMPTY, Observable, Subject } from 'rxjs';
import { DataProviderService } from '../dataProviders/data-provider.service';
import { UserData } from 'src/structures/user.structure';

import { registerPlugin } from '@capacitor/core';
export interface AuthPlugin {
  startAuth(): Promise<{idToken:string,accessToken:string}>;
}
const PluginAuthService = registerPlugin<AuthPlugin>('AuthPlugin');
export default PluginAuthService;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  phoneAuth = getAuth();
  userDocument!: DocumentReference;
  public userAvailable: Subject<any> = new Subject()
  public userId: any;
  public userIsLoggedIn: boolean = false;
  public newUser: boolean = false;
  public readonly user: Observable<User | null> = EMPTY;
  // private currentUser: User;
  private currentUser: any;
  constructor(
    private fs: Firestore,
    private auth: Auth,
    private router: Router,
    private dataprovider: DataProviderService,
    private alertify: AlertsAndNotificationsService,
    private platform: Platform
  ) {
    if (auth) {
      console.log(this.auth);
      this.user = authState(this.auth);

      this.user.subscribe((user: any) => {
        if (user) {
          this.currentUser = user;
          console.log(user)
          this.userIsLoggedIn = true;
          this.userId = user.uid;
          this.dataprovider.user = user;
          this.userAvailable.next(user);
        }
        else {
          this.userIsLoggedIn = false;
        }
      })
    }
  }


  public signInWithPhoneNumber(phoneNumber: number) {
    const verifier = new RecaptchaVerifier('recaptcha-container',{size:'invisible'},this.auth)
    return linkWithPhoneNumber(this.currentUser, ('+91' + phoneNumber), verifier);
  }

  public loginWithEmailPassword(email: any, password: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  public async signUpWithEmailAndPassword(formValue: any) {
    this.dataprovider.loading = true;
    const delay = (time: number) => new Promise((res) => setTimeout(res, time));
    try {
      let options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          data: {
            email: formValue.email,
            password: formValue.password,
            confirmPassword: formValue.confirmPassword,
            username: formValue.username,
          },
        }),
      };
      let res = fetch(
        'https://us-central1-urbanlaundryadmin.cloudfunctions.net/createUser',
        options
      )
        .then(async (res) => {
          if (res.status == 200) {
            return res.json();
          }
          throw new Error(await res.text());
        })
        .then(async (res) => {
          console.log('USR', res);
          await delay(1000);
          let credentials = await signInWithEmailAndPassword(
            this.auth,
            formValue.email,
            formValue.password
          );
          let a = await this.setEmailUserData(credentials.user, {
            phoneNumber: '',
            photoURL: '',
            displayName: formValue.username || '',
            dateOfBirth: Date.now(),
            gender: '',
            address: '',
          });
          this.dataprovider.loading = false;
          return a;
        })
        .catch((err) => {
          console.log(err);
          this.alertify.presentToast(err.message);
          this.dataprovider.loading = false;
        });
    } catch (error) {
      console.log(error);
      this.alertify.presentToast(
        'Some error occurred. Please try again later.'
      );
      this.dataprovider.loading = false;
    }
  }

  public async setEmailUserData(user: User, userData: any) {
    let data: UserData = {
      id: user.uid || '',
      email: user.email || '',
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || this.getRandomImage(),
      phone: userData.phoneNumber || '',
      emailVerified: true,
      access: { access: 'agent' },
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender || '',
      currentAddress: userData.address || '',
      phoneVerify: false,
      currentLanguage: 'english'
      
    };
    this.userDocument = doc(this.fs, urls.users + user.uid);
    await setDoc(this.userDocument, data).then(() => {
      // this.alertify.presentToast('Account created Successfully');
      // this.router.navigateByUrl('/root/pickup');
    });
    this.dataprovider.loading = false;
    // this.router.navigate(['/all-products'])
  }

  public async setGoogleUserData(user: User, userData: any) {
    let data: UserData = {
      id: user.uid || '',
      email: user.email || '',
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || this.getRandomImage(),
      phone: userData.phoneNumber || '',
      emailVerified: true,
      access: { access: 'agent' },
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender || '',
      currentAddress: userData.address || '',
      phoneVerify: false,
      currentLanguage: 'english'
    };
    this.userDocument = doc(this.fs, urls.users + user.uid);
    await setDoc(this.userDocument, data).then(() => {
      this.alertify.presentToast('Account created Successfully');
      // this.router.navigateByUrl('/home');
    });

    // this.router.navigate(['/all-products'])
  }

  getRandomImage(): string {
    return (
      'https://avatars.dicebear.com/api/gridy/' +
      (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)) +
      '.svg'
    );
  }

  public async logout() {
    this.dataprovider.LoggedInUser = false;
    this.dataprovider.user = {} as UserData;

    return await signOut(this.auth).then((res) => {
      this.router.navigateByUrl('/login')
    });
  }

  public async signUpWithGoogle() {
    this.alertify.presentToast("Service is not available.")
    return;
    this.dataprovider.loading = true;
    if (this.platform.is('capacitor')) {
      PluginAuthService.startAuth().then((res) => {
        // alert("good res"+JSON.stringify(res));
        const credential = GoogleAuthProvider.credential(
          res.idToken,
          res.accessToken
        );
        signInWithCredential(this.auth, credential)
          .then((credentials: UserCredential) => {
            console.log('Credentials ', credentials);
            getDoc(doc(this.fs, urls.users + credentials.user.uid))
              .then((userDocument: any) => {
                if (!userDocument.exists()) {
                  this.setEmailUserData(credentials.user, {
                    phone: credentials.user.phoneNumber || '',
                    photoURL: credentials.user.photoURL || '',
                    displayName: credentials.user.displayName || '',
                    dateOfBirth: Date.now(),
                    gender: '',
                  }).then(() => {
                    this.dataprovider.loading = false;
                    // this.router.navigate(['']);
                  }).catch((err) => {
                    this.dataprovider.loading = false;
                    this.alertify.presentToast(
                      err.message,
                      'error',
                      5000,
                      [],
                      true,
                      ''
                    );
                  });
                } else {
                  this.dataprovider.loading = false;
                  this.alertify.presentToast(
                    'Logged In.',
                    'info',
                    5000,
                    [],
                    true,
                    ''
                  );
                  this.router.navigate(['']);
                }
              })
              .catch((error) => {
                this.dataprovider.loading = false;
                console.log('ErrorCatched getting data', error);
                this.alertify.presentToast(
                  error.message,
                  'error',
                  5000,
                  [],
                  true,
                  ''
                );
              });
          })
          .catch((error) => {
            console.log('ErrorCatched authorizing', error);
            this.dataprovider.loading = false;
            this.alertify.presentToast(
              error.message,
              'error',
              5000,
              [],
              true,
              ''
            );
          });
      }).catch((err) => {
        this.dataprovider.loading = false;
        this.alertify.presentToast("Some error occured.")
      })
    } else {
      const gauth = new GoogleAuthProvider();
      signInWithPopup(this.auth, gauth)
        .then((credentials: UserCredential) => {
          console.log('Credentials ', credentials);
          getDoc(doc(this.fs, urls.users + credentials.user.uid))
            .then((userDocument: any) => {
              if (!userDocument.exists()) {
                this.setEmailUserData(credentials.user, {
                  phone: credentials.user.phoneNumber || '',
                  photoURL: credentials.user.photoURL || '',
                  displayName: credentials.user.displayName || '',
                  dateOfBirth: Date.now(),
                  gender: '',
                }).then(() => {
                  this.dataprovider.loading = false;
                  // this.router.navigate(['']);
                });
              } else {
                this.dataprovider.loading = false;
              }
              // this.router.navigateByUrl('/home');
            })
            .catch((error) => {
              console.log('ErrorCatched getting data', error);
              this.dataprovider.loading = false;
              this.alertify.presentToast(
                error.message,
                'error',
                5000,
                [],
                true,
                ''
              );
            });
        })
        .catch((error) => {
          // console.log(error.message);
          console.log('Error when signing in');
        })
        .finally(() => {
          console.log('Finally');
          this.dataprovider.loading = false;
        });
    }
  }
}
