import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';
import { ApiService } from './service/api.service';
import { ToastService } from './service/toast.service';
import { SideMenuService } from './service/side-menu.service';


@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule
  ],
  providers: [ApiService, ToastService, SideMenuService],
  exports: [HeaderComponent, FooterComponent]
})
export class CoreModule { }
