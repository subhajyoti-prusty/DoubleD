import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ResourceManagementRoutingModule } from './resource-management-routing.module';
import { ResourceManagementComponent } from './resource-management.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ResourceManagementComponent
  ],
  imports: [
    CommonModule,
    ResourceManagementRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ResourceManagementModule { }
