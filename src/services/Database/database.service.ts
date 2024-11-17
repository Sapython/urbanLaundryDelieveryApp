import { Injectable } from '@angular/core';
import { addDoc, collection, collectionChanges, collectionData, doc, docData, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
// import { query } from '@firebase/database';

import { Subject,BehaviorSubject  } from 'rxjs';
import { notificationStructure } from 'src/structures/notification.structure';

import { DataProviderService } from '../dataProviders/data-provider.service';
import { urls } from '../url';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public notifications: notificationStructure[] = [];
  notificationChanged: BehaviorSubject<notificationStructure[]> = new BehaviorSubject<notificationStructure[]>([]);
  storage = getStorage();
  
  constructor(private fs: Firestore, public dataProvider: DataProviderService) {
  }

  async upload(
    path: string,
    file: File | ArrayBuffer | Blob | Uint8Array
  ): Promise<any> {

    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        await task;
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (e: any) {
        console.error(e);
        return e;
      }
    } else {
      // handle invalid file
      return false;
    }
  }

  createBooking(data: any) {
    return addDoc(collection(this.fs, urls.bookings), data);
  }

  singleBooking(BOOKING_ID: any) {
    const bookingUrl = urls.booking.replace('{BOOKING_ID}', BOOKING_ID);
    return getDoc(doc(this.fs, bookingUrl));
  }

  updateBooking(BOOKING_ID: any, data:any) {
    const bookingUrl = urls.booking.replace('{BOOKING_ID}', BOOKING_ID);
    return setDoc(doc(this.fs, bookingUrl), data,{merge:true});
  }

  bookings() {
    return getDocs(collection(this.fs, urls.bookings))
  }

  contactUs(data: any) {
    return addDoc(collection(this.fs, urls.contactUs), data);
  }

  createNotification( userId:string, data: notificationStructure) {
    const notificationUrl = urls.notification.replace('{USER_ID}', userId);
    return addDoc(collection(this.fs, notificationUrl), data);
  }

  getNotifications(userId:string) {
    const notificationUrl = urls.notification.replace('{USER_ID}', userId);
    return collectionData(collection(this.fs, notificationUrl), { idField: 'id' });
  }

  markNotificationAsRead(id: any) {
    return updateDoc(doc(this.fs,urls.notification.replace('{USER_ID}', this.dataProvider.user!.id || '')+'/'+id),{viewed:true})
  }

  getAllPickupJobs(){
    return collectionData(query(collection(this.fs, urls.bookings),where('pickupAgentId','==',this.dataProvider.user?.id),where('stage.stage','not-in',['pickupAssigned','deliveryAssigned'])),  { idField: 'id' })
  }

  getHistory(){
    return getDocs(query(collection(this.fs, urls.bookings),where('pickupAgentId','==',this.dataProvider.user?.id),where('stage.stage','not-in',['pending','pickupAssigned','pickupStarted','outForDelivery','deliveryAssigned'])))
  }

  getAllPickupHistory(){
    return getDocs(query(collection(this.fs, urls.bookings),where('pickupAgentId','==',this.dataProvider.user?.id),where('stage.stage','not-in',['pending','pickupAssigned','pickupStarted'])))
  }

  getAllDeliveryHistory(){
    return getDocs(query(collection(this.fs, urls.bookings),where('deliveryAgentId','==',this.dataProvider.user?.id),where('stage.stage','not-in',['pending','pickupAssigned','pickupStarted','outForDelivery','deliveryAssigned'])))
  }

  getPickupJobs(){
    console.log("pickupAgentId", "==", this.dataProvider.user?.id + 'show')
    return collectionData(query(collection(this.fs, urls.bookings),where('pickupAgentId','==',this.dataProvider.user?.id),where('stage.stage','in',['pickupAssigned','pickupStarted'])),  { idField: 'id' })
  }

  getDeliveryJobs(){
    console.log("pickupAgentId", "==", this.dataProvider.user?.id + 'show')
    return collectionData(query(collection(this.fs, urls.bookings),where('deliveryAgentId','==',this.dataProvider.user?.id),where('stage.stage','in',['outForDelivery','deliveryAssigned'])),  { idField: 'id' })
  } 

  services(){
    return getDocs(collection(this.fs, urls.services))
  }

  singleService(SERVICE_ID:any){
    const serviceUrl = urls.service.replace('{SERVICE_ID}', SERVICE_ID);
    console.log(urls.service.replace('{SERVICE_ID}', SERVICE_ID))
    return getDoc(doc(this.fs, serviceUrl))
  }
// for  - data is coming form delivery component
  message:any;
  getData(data:any){
    this.message = data;
  }

  // to send the data
  sendData(){
    return this.message;
  }

  getSettings(){
    return getDoc(doc(this.fs, urls.settings))
  }

  async getLedger(ledger: string) {
    let collectionRef = collection(this.fs, 'ledgers/ledger/' + ledger);
    let collectionSnap = await getDocs(collectionRef);
    if (collectionSnap.docs.length > 0) {
      return collectionSnap.docs[0].data();
    } else {
      return null;
    }
  }
  async updateLedger(ledger: string, data: any) {
    let collectionRef = collection(this.fs, 'ledgers/ledger/' + ledger);
    let collectionSnap = await getDocs(collectionRef);
    if (collectionSnap.docs.length > 0) {
      return updateDoc(collectionSnap.docs[0].ref, data);
    } else {
      return null;
    }
  }
}