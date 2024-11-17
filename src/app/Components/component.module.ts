import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DropzoneDirective } from './dropzone/drop-zone.directive';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './loading/loading.component';




@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DropzoneDirective,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    DropzoneDirective,
    LoadingComponent
  ]
})
export class ComponentModule { }
