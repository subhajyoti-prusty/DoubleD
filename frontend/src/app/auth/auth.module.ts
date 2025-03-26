import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthenticationService } from './service/authentication.service';
<<<<<<< HEAD
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule
=======



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule
>>>>>>> c0b01643d8e827ce0af2549620d6cd9a5cd1001c
  ],
  providers: [AuthenticationService]
})
export class AuthModule { }
