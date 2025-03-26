import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ReactiveFormsModule } from '@angular/forms';
=======
>>>>>>> c0b01643d8e827ce0af2549620d6cd9a5cd1001c

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
<<<<<<< HEAD
    ReactiveFormsModule,
=======
>>>>>>> c0b01643d8e827ce0af2549620d6cd9a5cd1001c
    SharedModule
  ]
})
export class ResourceManagementModule { }
