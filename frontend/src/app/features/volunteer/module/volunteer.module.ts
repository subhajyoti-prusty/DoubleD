import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolunteerComponent } from '../component/volunteer.component';
import { VolunteerRoutingModule } from './volunteer-routing.module';

@NgModule({
  declarations: [
    VolunteerComponent
  ],
  imports: [
    CommonModule,
    VolunteerRoutingModule
  ],
  exports: [VolunteerComponent]
})
export class VolunteerModule { }
