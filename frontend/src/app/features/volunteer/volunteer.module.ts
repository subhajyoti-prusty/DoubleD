import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VolunteerRoutingModule } from './volunteer-routing.module';
import { VolunteerComponent } from '../volunteer/volunteer.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    VolunteerComponent
  ],
  imports: [
    CommonModule,
    VolunteerRoutingModule,
    SharedModule
  ]
})
export class VolunteerModule { }
