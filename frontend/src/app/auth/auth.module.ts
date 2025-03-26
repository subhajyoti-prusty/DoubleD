import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthenticationService } from './service/authentication.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule
  ],
  providers: [AuthenticationService]
})
export class AuthModule { }
