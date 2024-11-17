import { Component, OnInit } from '@angular/core';
import { DataProviderService } from 'src/services/dataProviders/data-provider.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Bookings } from 'src/structures/bookings.structure';
import { registerPlugin } from '@capacitor/core';
import { Router } from '@angular/router';
export interface GoogleMapPlugin {
  openGoogleMap(options: { latitude: number,longitude:number }): Promise<void>;
  // openGoogleMap(): Promise<void>;
}
const PluginGoogleMapsService = registerPlugin<GoogleMapPlugin>('GoogleMaps');
export default PluginGoogleMapsService;
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  currentPosition:google.maps.LatLngLiteral|undefined;
  center: google.maps.LatLngLiteral|undefined;
  zoom = 18;
  mapOptions: google.maps.MapOptions = {
    zoom: 18,
    mapTypeId: 'roadmap',
    disableDefaultUI: true,
  }
  currentPickupData:Bookings|undefined;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  centerMarkerOptions: google.maps.MarkerOptions = {draggable: false, icon: './assets/circle.png',};
  coordinates:Position|undefined;
  
  constructor(public dataProvider:DataProviderService,private router:Router) {
    if(this.dataProvider.currentPickup){
      this.currentPickupData = this.dataProvider.currentPickup;
    }
  }

  async ngOnInit() {
    await Geolocation.checkPermissions().then(async (res)=>{
      if(res.location != 'granted'){
        Geolocation.requestPermissions().then(async (res)=>{
          console.log(res);
          this.coordinates = await Geolocation.getCurrentPosition();
          this.currentPosition = {
            lat: this.coordinates.coords.latitude,
            lng: this.coordinates.coords.longitude,
          }
          console.log("this.currentPosition",this.currentPosition);
        })
      } else {
        this.coordinates = await Geolocation.getCurrentPosition();
          this.currentPosition = {
            lat: this.coordinates.coords.latitude,
            lng: this.coordinates.coords.longitude,
          }
          console.log("this.currentPosition",this.currentPosition);
      }
    });
    this.center = {
      lat: this.dataProvider.currentPickup?.userDetails.pickupAddress.latitude || 0,
      lng: this.dataProvider.currentPickup?.userDetails.pickupAddress.longitude || 0,
    }
    console.log(this.center,this.dataProvider.currentPickup?.userDetails.pickupAddress.latitude);
    
    this.coordinates = await Geolocation.getCurrentPosition();
    this.currentPosition = {
      lat: this.coordinates.coords.latitude,
      lng: this.coordinates.coords.longitude,
    }
  }

  verifyOtp(pickup: Bookings,event:any) {
    event.stopPropagation();
    this.dataProvider.currentPickup = pickup;
    this.dataProvider.currentPickupId = pickup.id;
    if (pickup.stage.stage in ['pickupAssigned','pickupStarted','pickupReceived','pickupCompleted']) {
      this.dataProvider.mode = 'pickup'
    }
    this.dataProvider.mode = 'delivery'
    this.router.navigateByUrl('root/verify-otp');
  }

  openGoogleMaps(){
    alert("Opening on google maps")
    PluginGoogleMapsService.openGoogleMap({
      latitude: this.dataProvider.currentPickup?.userDetails.pickupAddress.latitude || 0,
      longitude: this.dataProvider.currentPickup?.userDetails.pickupAddress.longitude || 0
    }).then((res)=>{
      console.log(res);
      alert("Opened on google maps")
    }).catch((err)=>{
      console.log(err);
      alert("Error opening on google maps")
    })
  }
} 
