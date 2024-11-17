import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

import Fuse from 'fuse.js';
import { DatabaseService } from 'src/services/Database/database.service';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { Bookings, Cloth, Service } from 'src/structures/bookings.structure';

@Component({
  selector: 'app-clothes',
  templateUrl: './clothes.page.html',
  styleUrls: ['./clothes.page.scss'],
})
export class ClothesPage {
  canDismiss = false;
  filteredClothes: NewCloth[] = []
  ledgerDate: string = '';
  services: ActiveService[] = (this.dataProvider.currentPickup?.services || []) as ActiveService[];
  currentService: any | undefined;
  totalAppliedTax: number = 0;
  total: number = 0;
  grandTotal: number = 0;
  totalNoOfKgs: number = 0;
  finalizedClothes: NewCloth[] = []
  billItems: { name: string, cost: number, quantity: number }[] = []
  totalQuantity: number = 0;
  mode:'add'|'view' = 'view';
  @Output() close: EventEmitter<any> = new EventEmitter();
  fuseSearch: any;
  constructor(public dataProvider: DataProviderService, public database: DatabaseService, public router:Router, private alertify: AlertsAndNotificationsService,private activatedRoute:ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => {
      console.log("ROUTE",params);
      if(params['mode'] == 'add'){
        this.mode = 'add'
      } else {
        this.mode = 'view'
      }
    })
    
  }

  ionViewDidLeave() {
    this.resetValues()
  }

  deleteSelectedCloth(activeClothes:any[],i:number){
    activeClothes.splice(i,1);
    this.calculateTotal();
  }

  ionViewWillEnter() {
    console.log("this.dataProvider.currentPickup.services",this.dataProvider.currentPickup);
    this.services = (this.dataProvider.currentPickup?.services || []) as ActiveService[];
    // alert(this.services.length)
    if (this.mode=='view' && this.dataProvider.currentPickup){
      this.services = this.dataProvider.currentPickup.services as ActiveService[];
      this.totalAppliedTax = this.dataProvider.currentPickup.billingDetail.tax
      this.total = this.dataProvider.currentPickup.billingDetail.total
      this.grandTotal = this.dataProvider.currentPickup.billingDetail.grandTotal
    }
    this.currentService = this.services[0]
    console.log(this.services);
    this.currentService.activeClothes = this.currentService.activeClothes ? this.currentService.activeClothes : []
    this.filteredClothes = this.currentService.clothes
    this.fuseSearch = new Fuse(this.currentService.clothes, {
      keys: ['name', 'cost'],
    })
    this.calculateTotal()
  }

  resetValues(){
    this.services = []
    this.total = 0;
    this.totalQuantity = 0;
    this.billItems = []
    this.totalAppliedTax = 0;
    this.grandTotal = 0;
    this.filteredClothes = []
    this.currentService = undefined;
    this.totalNoOfKgs = 0;
    this.currentService = undefined;
    this.finalizedClothes = []
  }

  calculateTotal() {
    console.log("this.services",this.services);
    let total = 0;
    this.totalQuantity = 0;
    this.billItems = []
    this.services.forEach((service) => {
      if (service.type == true && (service.activeClothes || []).length > 0) {
        console.log("calc", service.costPerKg, service.noOfKgs);
        total += Number(service.costPerKg) * Number(service.noOfKgs)
        this.billItems.push({
          name: service.name,
          cost: Number(service.costPerKg) * Number(service.noOfKgs),
          quantity: Number(service.noOfKgs)
        })
        service.activeClothes.forEach((cloth) => {
          this.totalQuantity += cloth.count || 1
        })
      } else {
        console.log("service calc", service);
        if (service && service.activeClothes && service.activeClothes.length > 0){
          service.activeClothes.forEach((cloth) => {
            console.log("calc", cloth.cost, cloth.count);
            total += cloth.cost * (cloth.count || 1)
            this.billItems.push({
              name: cloth.name,
              cost: cloth.cost * (cloth.count || 1),
              quantity: cloth.count || 1
            })
            this.totalQuantity += cloth.count || 1
          })
        }
      }
    })
    this.total = total;
    // get taxes
    let discountedTotal = this.roundOff(this.total - ((this.total/100) * this.dataProvider.currentPickup!.billingDetail.discount));
    this.totalAppliedTax = 0;
    if (this.dataProvider.appSettings.tax.tax){
      this.totalAppliedTax = this.roundOff((discountedTotal/100) * this.dataProvider.appSettings.tax.tax);
    }
    this.grandTotal = this.roundOff(discountedTotal + this.totalAppliedTax)
  }

  roundOff(num:number){
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  initClothBillingToDB() {
    this.dataProvider.loading = true;
    if (this.mode == 'add'){
      console.log(this.services,this.total,this.totalQuantity,this.billItems,this.dataProvider.currentPickup);
      const data = {
        billingDetail: {
          total: this.total,
          couponCodeId: '',
          discount: 0,
          tax: this.dataProvider.appSettings.tax.tax,
          grandTotal: this.grandTotal
        },
        stage:{
          stage:'pickupReceived',
          message:'Pickup Received',
          log:[{
            date:Timestamp.fromDate(new Date()),
            stage:'pickupReceived',
            message:'Pickup Received',
            userId:this.dataProvider.user?.id
          },...this.dataProvider.currentPickup!.stage.log || []]
        },
        services: this.services,
        totalWeight: this.totalNoOfKgs,
        activeClothes: this.billItems,
      }
      console.log(data);
      console.log(this.dataProvider?.currentPickupId);
      this.database.updateBooking(this.dataProvider?.currentPickupId ,data).then((res) => {
        console.log(res);
        // this.dataProvider.currentPickup = data;
        // RESET DATA
        this.dataProvider.currentPickup = undefined;
        this.dataProvider.currentPickupId = undefined;
        // reset values
        this.services = []
        this.total = 0;
        this.totalQuantity = 0;
        this.billItems = []
        this.totalAppliedTax = 0;
        this.grandTotal = 0;
        this.filteredClothes = []
        this.currentService = undefined;
        this.totalNoOfKgs = 0;
        this.currentService = undefined;
        this.finalizedClothes = []
        this.resetValues();
        this.alertify.presentToast('Booking Received Successfully')
        this.router.navigateByUrl('root/confirm')
      }).catch((err) => {
        console.log(err);
        this.alertify.presentToast('Something went wrong')
      }).finally(() => {
        this.dataProvider.loading = false;
      })
    } else {
      console.log("this.dataProvider.currentPickup",this.dataProvider.currentPickup);
      if (this.dataProvider.currentPickup){
        this.database.updateBooking(this.dataProvider.currentPickup.id, {stage: {
          stage:'deliveryCompleted',
          message: 'Delivery Finished',
          log:[{
            stage:'deliveryCompleted',
            date: Timestamp.fromDate(new Date()),
            userId: this.dataProvider.user?.id || '',
            message:'Delivery Finished'
          },...(this.dataProvider.currentPickup.stage.log || [])]
        }}).then((res) => {
          if (this.dataProvider.currentPickup){
            let data:any = {
              to:"Admin",
              narration: "Delivery Completed for Booking Id: "+this.dataProvider.currentPickup.id,
              amount: this.dataProvider.currentPickup.billingDetail.grandTotal,
              from: this.dataProvider.user?.id || '',
              transactionId: this.dataProvider.currentPickup.id,
              time: Timestamp.fromDate(new Date()),
            }
            let date = new Date();
            this.ledgerDate = [
              date.getDate(),
              date.getMonth() + 1,
              date.getFullYear(),
            ].join('.');
            if (data) {
              this.database.getLedger(this.ledgerDate).then((res) => {
                if (res) {
                  let updateLedger = res as Ledger;
                  updateLedger.creditLedger.push(data as LedgerTransaction);
                  updateLedger.totalCredit += +data.amount;
                  this.database
                    .updateLedger(this.ledgerDate, updateLedger)
                    .then((res) => {
                      console.log(res);
                      this.dataProvider.loading = false;
                    });
                }
              });
            }
            // reset all data
            this.dataProvider.currentPickup = undefined;
            this.dataProvider.currentPickupId = undefined;
            // reset values
            this.dataProvider.loading = false;
            this.router.navigateByUrl('root/confirm')
            this.resetValues();
          }
        })
      }
    }
  }


  isModalOpen = false;

  switchService(event: any) {
    console.log(event);
    if(event.detail.value){
      this.currentService = event.detail.value
      this.currentService.activeClothes = this.currentService.activeClothes ? this.currentService.activeClothes : []
      this.fuseSearch = new Fuse(this.currentService.clothes, {
        keys: ['name', 'cost'],
      })
      this.filteredClothes = this.currentService.clothes
      this.calculateTotal();
    }
  }

  search(event: any) {
    console.log(event);
    if (!this.fuseSearch) {
      this.filteredClothes = this.currentService.clothes
    }
    if(!event.detail.value){
      this.filteredClothes = this.currentService.clothes
      return;
    }
    // this.searchTerm = value;
    const result = this.fuseSearch.search(event.detail.value);
    console.log(result);
    this.filteredClothes = result.map((item: any) => item.item);
  }

  addToClothes(cloth: Cloth, event: any) {
    console.log(event);
    let checked = event.detail.checked
    if (checked) {
      this.currentService.activeClothes.push({
        ...cloth,
        checked: true,
        count: 1
      })
    } else {
      this.currentService.activeClothes = this.currentService.activeClothes.filter((item: NewCloth) => item.id !== cloth.id)
    }
    console.log(this.currentService.activeClothes, this.services);
    this.calculateTotal();
  }

  existsInClothes(cloth: Cloth) {
    return this.finalizedClothes.find((item: NewCloth) => item.id === cloth.id)
  }
}
export interface NewCloth extends Cloth {
  checked: boolean;
  count: number;
}

export interface ActiveService extends Service {
  activeClothes: NewCloth[]
  noOfKgs: number
}
interface Ledger {
  date: Date;
  description: string;
  totalDebit: number;
  totalCredit: number;
  creditLedger: LedgerTransaction[];
  debitLedger: LedgerTransaction[];
}
interface LedgerTransaction {
  transactionId: string;
  time: any;
  to: string;
  narration: string;
  from: string;
  amount: number;
}
