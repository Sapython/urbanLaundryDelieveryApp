import { Injectable } from '@angular/core';
import { ConfirmationResult } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { Bookings } from 'src/structures/bookings.structure';
import { UserData } from 'src/structures/user.structure';
// import { UserStructure } from 'src/structures/user.structure';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  public LoggedInUser :boolean = false;
  public user:UserData|undefined;
  public loading:boolean = false;
  public chooseService:any[]=[];
  public signUp:any;
  public mode:'delivery'|'pickup' = 'pickup';
  public notification:any[] = [];
  public phoneData : ConfirmationResult | any ;
  public appSettings:any;
  public currentPickup:Bookings|undefined;
  public currentPickupId:any;
  public currentBooking:Bookings|undefined;
  constructor() { }
}